interface masterJsonEntry {
    id: string,
    album: string,
    originalName: string,
    url: string,
    changes: string,
    history: imageChangeTimestamp[]
    tags?: string[]
}

interface imageChangeTimestamp {
    status: string,
    timestamp: number,
    url: string
}

export { masterJsonEntry, imageChangeTimestamp }