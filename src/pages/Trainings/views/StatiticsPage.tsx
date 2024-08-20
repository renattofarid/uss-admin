import { SemesterStore } from "@/pages/Semesters/store/SemesterStore"
import { AssistanceByYear } from "./charts/AssistanceByYear"
import AssistanceBySchool from "./charts/AssitanceBySchool/page"
import { ProfessorsByEmploymentType } from "./charts/ProfessorsByEmploymentType"
import TrainingsByCompetencyPage from "./charts/TrainingsByCompetency/page"
import React from "react"

function StatiticsPage() {
    const { getData: getSemesters } = SemesterStore()
    React.useEffect(() => {
        getSemesters()
    }, [])
    return (
        <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full h-full"><ProfessorsByEmploymentType /></div>
                <div className="w-full h-full"><AssistanceByYear /></div>
                {/* <div className="w-full h-full">block 3</div> */}
                {/* <div className="w-full h-full">block 4</div> */}
            </div>
            <div className="py-2"><AssistanceBySchool /></div>
            <div className="py-2"><TrainingsByCompetencyPage /></div>
        </div>
    )
}

export default StatiticsPage