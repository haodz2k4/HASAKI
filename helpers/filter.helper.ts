
interface IFilter {
    result: string;
    name: string;
    value: string;
    selected: boolean
}

export default (filters: IFilter[]) :IFilter[] => {
    
    return [
        ...filters,
        {
            result: "active",
            name: "Hoạt động",
            value: 'status-active',
            selected: false
        },
        {
            result: "inactive",
            name: "Không Hoạt động",
            value: 'status-inactive',
            selected: false
        }
    ]
}