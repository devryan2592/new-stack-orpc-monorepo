export type OrpcClientOptions = {
  baseUrl: string
}

export function createClient(options: OrpcClientOptions) {
  return { baseUrl: options.baseUrl }
}