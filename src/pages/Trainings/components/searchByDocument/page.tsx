import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchTrainingStore } from "../../store/SearchTrainingStore"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { DataTableCertificates } from "./table"
import { columns } from "./columns"

function SearchByDocument() {
    const { loading, getCertificationsByDNI, trainings } = SearchTrainingStore()
    const { register, formState: { errors }, watch } = useForm({
        values: {
            documentNumber: '' as unknown as number,
        }
    })
    const { documentNumber } = watch()

    useEffect(() => {
        if (!documentNumber) return

        if (documentNumber.toString().length === 8) {
            getCertificationsByDNI(documentNumber)
        }
    }, [documentNumber])
    return (
        <main className="flex flex-col gap-4 p-4">
            <section className="">
                <h1 className="text-2xl font-semibold">Certificaciones por Documento</h1>
            </section>

            <div className='lg:max-w-[960px] px-0 md:px-12 xl:px-4 flex flex-col gap-4'>

                <div className="grid w-1/3 gap-1.5">
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                        type="number" id="dni" placeholder="Inserte DNI"
                        disabled={loading}
                        {...register('documentNumber', {
                            pattern: {
                                value: /^[0-9]*$/,
                                message: 'El DNI solo puede contener números'
                            },
                            required: {
                                value: true,
                                message: 'El DNI es requerido'
                            },
                            maxLength: {
                                value: 8,
                                message: 'El DNI debe tener 8 dígitos'
                            },
                            minLength: {
                                value: 8,
                                message: 'El DNI debe tener 8 dígitos'
                            }
                        })}
                    />
                    <span className="text-red-500 text-xs">{errors.documentNumber && (
                        <>{errors.documentNumber.message}</>
                    )}</span>
                    <span className="text-blue-500 text-xs">{loading && (
                        <>Realizando búsqueda...</>
                    )}</span>
                </div>
            </div>

            {trainings && trainings.trainings.length > 0 && (
                <div className='w-full flex flex-col gap-4 lg:max-w-[960px]'>
                    <h2 className='w-full mx-auto px-0 md:px-12 xl:px-4 text-xl'>Certificaciones encontradas</h2>

                    <div className="w-full mx-auto px-0 md:px-12 xl:px-4">
                        <DataTableCertificates columns={columns} data={trainings.trainings as any} />
                    </div>
                </div>
            )}
            {trainings && trainings.trainings.length === 0 && (
                <div className='w-full flex flex-col gap-4 lg:max-w-[960px]'>
                    <h2 className='w-full mx-auto px-0 md:px-12 xl:px-4 text-xl'>No se encontraron certificaciones</h2>

                </div>
            )}
        </main>
    )
}

export default SearchByDocument