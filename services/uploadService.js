export const uploadService = {
  async uploadFile(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header, let the browser set it with boundary
        }
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }
}