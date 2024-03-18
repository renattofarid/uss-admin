export interface Column{
    field: string,
    headerName: string,
    sortable?: boolean,
    sortBy?: string,
    className?: string,
}

export interface ExtraColumn extends Column{
    render: (row: any) => React.ReactNode
}