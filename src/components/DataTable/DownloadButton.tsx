interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

export function DownloadButton(props: Props) {
    return (
        <button {...props}>Descargar</button>
    )
}
