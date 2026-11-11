import { apiRequest } from '../../../shared/services/apiClient'

export const notesApi = {
    getAll() {
        return apiRequest('/notes')
    },

    create(rawContent) {
        return apiRequest('/notes', {
            method: 'POST',
            body: JSON.stringify({ rawContent }),
        })
    },

    getById(id) {
        return apiRequest(`/notes/${id}`)
    },

    update(id, rawContent) {
        return apiRequest(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ rawContent }),
        })
    },

    delete(id) {
        return apiRequest(`/notes/${id}`, {
            method: 'DELETE',
        })
    },
}