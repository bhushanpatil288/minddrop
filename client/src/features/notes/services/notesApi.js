const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(endpoing, options = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoing}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    };

    return data.data;
}

export const notesApi = {
    getAll() {
        return request('/notes');
    },

    create(rawContent) {
        return request('/notes', {
            method: 'POST',
            body: JSON.stringify({ rawContent }),
        })
    },

    getById(id) {
        return request(`/notes/${id}`);
    }
}