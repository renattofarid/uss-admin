import { AssistanceByYear } from "./charts/AssistanceByYear"
import AssistanceBySchool from "./charts/AssitanceBySchool/page"

function StatiticsPage() {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><AssistanceByYear /></div>
                <div>block 2</div>
                <div>block 3</div>
                <div>block 4</div>
            </div>
            <div><AssistanceBySchool /></div>
        </div>
    )
}

export default StatiticsPage