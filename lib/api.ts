export interface Recipe {
  title: string
  duration: string
  difficulty: string
  calories: string
  ingredients: string[]
  steps: string[]
  tips: string[]
  alternatives: string[]
}

export interface APIResponse {
  success: boolean
  data?: Recipe
  error?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const RECIPE_PROMPT_PREFIX = `Kamu adalah chef profesional. Berdasarkan bahan-bahan berikut, buatkan resep masakan yang lezat dan mudah diikuti.

Berikan respons dalam format JSON yang valid dengan struktur berikut:
{
  "title": "Nama Resep",
  "duration": "30 menit",
  "difficulty": "Mudah/Sedang/Sulit",
  "calories": "250 kkal",
  "ingredients": ["bahan 1", "bahan 2"],
  "steps": ["langkah 1", "langkah 2"],
  "tips": ["tips 1", "tips 2"],
  "alternatives": ["alternatif bahan 1", "alternatif bahan 2"]
}

Bahan-bahan: `

const IMAGE_PROMPT = `Kamu adalah chef profesional. Analisis gambar ini dan identifikasi bahan-bahan makanan yang terlihat. Kemudian buatkan resep masakan yang lezat menggunakan bahan-bahan tersebut.

Berikan respons dalam format JSON yang valid dengan struktur berikut:
{
  "title": "Nama Resep",
  "duration": "30 menit",
  "difficulty": "Mudah/Sedang/Sulit",
  "calories": "250 kkal",
  "ingredients": ["bahan 1", "bahan 2"],
  "steps": ["langkah 1", "langkah 2"],
  "tips": ["tips 1", "tips 2"],
  "alternatives": ["alternatif bahan 1", "alternatif bahan 2"]
}`

function parseRecipeFromText(text: string): Recipe {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || 'Resep Lezat',
        duration: parsed.duration || '30 menit',
        difficulty: parsed.difficulty || 'Sedang',
        calories: parsed.calories || '200 kkal',
        ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
        steps: Array.isArray(parsed.steps) ? parsed.steps : [],
        tips: Array.isArray(parsed.tips) ? parsed.tips : [],
        alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : []
      }
    }
    throw new Error('No JSON found in response')
  } catch {
    // Fallback: create a basic recipe structure from text
    return {
      title: 'Resep Kreatif',
      duration: '30 menit',
      difficulty: 'Sedang',
      calories: '200 kkal',
      ingredients: ['Bahan sesuai ketersediaan'],
      steps: [text],
      tips: ['Sesuaikan bumbu dengan selera'],
      alternatives: []
    }
  }
}

export async function generateFromText(ingredients: string): Promise<APIResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: RECIPE_PROMPT_PREFIX + ingredients }),
    })

    if (!response.ok) {
      throw new Error('Gagal membuat resep')
    }

    const result = await response.json()
    
    if (result.success && result.data) {
      const recipe = parseRecipeFromText(result.data)
      return { success: true, data: recipe }
    }
    
    throw new Error(result.error || 'Gagal membuat resep')
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan' 
    }
  }
}

export async function generateFromImage(file: File): Promise<APIResponse> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('prompt', IMAGE_PROMPT)

    const response = await fetch(`${API_BASE_URL}/generate-from-image`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Gagal menganalisis gambar')
    }

    const result = await response.json()
    
    if (result.success && result.data) {
      const recipe = parseRecipeFromText(result.data)
      return { success: true, data: recipe }
    }
    
    throw new Error(result.error || 'Gagal menganalisis gambar')
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan' 
    }
  }
}
