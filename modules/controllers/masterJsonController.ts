interface masterJson {
    id:string,
    album:string,
    originalName:string,
    url:string,
    changes:string,
    history: imageChangeTimestamp[]
}

interface imageChangeTimestamp{
    status:string,
    timestamp:number
}

export {masterJson}