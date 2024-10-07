
interface IFilter {
    name: string;
    value: string;
    selected: boolean
}

export default (filters: IFilter[]) :IFilter[] => {
    
    return [
        ...filters,
        {
            name: "active",
            value: 'status-active',
            selected: false
        },
        {
            name: "inactive",
            value: 'status-inactive',
            selected: false
        }
    ]
}