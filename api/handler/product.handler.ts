import { Request, Response } from "express"
import { getAllProductsByQuery, getTotalDocument, updateProductById } from "../../services/product.service"
import pick from "../../utils/pick"
import paginationHelper from "../../helpers/pagination.helper"
import rangePriceHelper from "../../helpers/range-price.helper"
import catchAsync from "../utils/catchAsync"
import { ApiError } from "../utils/error"
//[GET] "/api/products"
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm với bộ lọc, phân trang và sắp xếp
 *     description: Trả về danh sách các sản phẩm với các bộ lọc khác nhau, bao gồm phân trang, tìm kiếm theo từ khóa, sắp xếp, và khoảng giá.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Trạng thái của sản phẩm (ví dụ: "available", "out of stock")
 *       - in: query
 *         name: highlighted
 *         schema:
 *           type: boolean
 *         description: Lọc các sản phẩm nổi bật (highlighted)
 *       - in: query
 *         name: sortKey
 *         schema:
 *           type: string
 *         description: Thuộc tính để sắp xếp (ví dụ: "price", "name")
 *       - in: query
 *         name: sortValue
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Giá trị sắp xếp (tăng dần "asc", giảm dần "desc")
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: Giá tối thiểu để lọc
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: Giá tối đa để lọc
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Từ khóa để tìm kiếm sản phẩm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang (pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm trên mỗi trang (pagination)
 *       - in: query
 *         name: only
 *         schema:
 *           type: string
 *         description: Chỉ chọn các trường cụ thể (ví dụ: "name,price")
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách các sản phẩm và thông tin phân trang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "615c5e91d97eeb001dee7f98"
 *                       name:
 *                         type: string
 *                         example: "Sản phẩm A"
 *                       price:
 *                         type: integer
 *                         example: 100000
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     totalDocuments:
 *                       type: integer
 *                       example: 200
 *       400:
 *         description: Lỗi dữ liệu đầu vào không hợp lệ
 */

export const getProducts = catchAsync(async (req: Request, res: Response) => {
    
    const query = pick(req.query,["status", "highlighted"]);
    const filter: Record<string, any> = {...query}
    //Sort
    const sortKey = req.query.sortKey as string;
    const sortValue = req.query.sortValue as "asc" | "desc";
    const sort: Record<string, "asc" | "desc"> = {}
    if(sortKey && sortValue) {
        sort[sortKey] = sortValue
    }
    //range price 
    const minPrice = parseInt(req.query.minPrice as string)
    const maxPrice = parseInt(req.query.maxPrice as string);
    
    filter.$and = rangePriceHelper(minPrice, maxPrice)
    //Search 
    const keyword = req.query.keyword as string;
    if(keyword){
        filter.keyword = keyword
    }
    //Pagination 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20 
    const skip = (page - 1) * limit;
    const totalDocument = await getTotalDocument({...filter})
    const pagination = paginationHelper(page, limit,totalDocument)
    const selectFields = req.query.only as string;
    const products = await getAllProductsByQuery({filter, limit, skip, sort, selectFields}) 
    res.json({products, pagination})
})
//[PATCH] "/api/products/:id"
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const body = req.body
    const product = await updateProductById(id,body);
    res.status(200).json({product})
})