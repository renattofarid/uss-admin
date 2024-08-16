import { getAsistanceBySchool, SchoolStatitic } from "@/services/reports"
import { useEffect, useState } from "react"
import { DataTableAssistanceBySchool } from "./table"
import { columns } from "./columns"

function AssistanceBySchool() {
    const [data, setData] = useState<SchoolStatitic[]>([])
    useEffect(() => {
      (
        async () => {
            const data = await getAsistanceBySchool()
            setData(data)
        }
      )()
    }, [])
    
  return (
    <div>
        <DataTableAssistanceBySchool columns={columns} data={data} />
    </div>
  )
}

export default AssistanceBySchool