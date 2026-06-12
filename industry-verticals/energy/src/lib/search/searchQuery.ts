const SEARCH_SOURCE = process.env.NEXT_PUBLIC_GRIDWELL_SEARCH_SOURCE as string;

export function applySearchSources(query: {
  getRequest: () => { addSource: (source: string) => void };
}) {
  if (SEARCH_SOURCE !== '') {
    SEARCH_SOURCE.split('|').forEach((source) => {
      query.getRequest().addSource(source.trim());
    });
  }
}
