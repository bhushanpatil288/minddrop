import { apiRequest } from '../../../shared/services/apiClient'

export const aiApi = {
    generateVersion(noteId, rawContent) {
        return apiRequest(`/ai/notes/${noteId}/versions`, {
            method: 'POST',
            body: JSON.stringify({ rawContent }),
        })
    },

    getVersions(noteId) {
        return apiRequest(`/ai/notes/${noteId}/versions`)
    },
}