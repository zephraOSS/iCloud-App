interface Clients {
    [key: string]: ClientData;
}

interface ClientData {
    client: Client;
    ready: boolean;
    presenceData?: PresenceData;
}

interface PresenceData {
    details: string;
    state?: string;
    startTimestamp?: number;
    endTimestamp?: number;
    largeImageKey?: string;
    largeImageText?: string;
    smallImageKey?: string;
    smallImageText?: string;
}
