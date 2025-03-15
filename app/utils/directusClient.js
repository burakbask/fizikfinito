//directusClient.js
import axios from 'axios';

export const getCollectionItems = async (collectionName) => {
  try {
    const directusUrl = process.env.PUBLIC_DIRECTUS_API_URL;
    const directusToken = process.env.PUBLIC_DIRECTUS_API_TOKEN;

    if (!directusUrl || !directusToken) {
      throw new Error("PUBLIC_DIRECTUS_API_URL or PUBLIC_DIRECTUS_API_TOKEN is not defined.");
    }

    const response = await axios.get(`${directusUrl}/items/${collectionName}`, {
      headers: {
        Authorization: `Bearer ${directusToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

export const getItem = async (collectionName, itemId) => {
  try {
    const directusUrl = process.env.PUBLIC_DIRECTUS_API_URL;
    const directusToken = process.env.PUBLIC_DIRECTUS_API_TOKEN;

    if (!directusUrl || !directusToken) {
      throw new Error("PUBLIC_DIRECTUS_API_URL or PUBLIC_DIRECTUS_API_TOKEN is not defined.");
    }

    const response = await axios.get(`${directusUrl}/items/${collectionName}`, {
      params: {
        filter: { slug: { _eq: itemId } }
      },
      headers: {
        Authorization: `Bearer ${directusToken}`,
      },
    });
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error(`Error fetching item from ${collectionName} with slug ${itemId}:`, error);
    return null;
  }
};

export const getItemBySlug = async (collectionName, slug, p0) => {
  const { fields } = p0; // Bu satırda "fields" parametresini çıkarıyoruz

  try {
    const directusUrl = process.env.PUBLIC_DIRECTUS_API_URL;
    const directusToken = process.env.PUBLIC_DIRECTUS_API_TOKEN;

    if (!directusUrl || !directusToken) {
      throw new Error("PUBLIC_DIRECTUS_API_URL or PUBLIC_DIRECTUS_API_TOKEN is not defined.");
    }

    const response = await axios.get(`${directusUrl}/items/${collectionName}`, {
      params: {
        filter: { slug: { _eq: slug } }
      },
      headers: {
        Authorization: `Bearer ${directusToken}`,
      },
    });
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error(`Error fetching item by slug from ${collectionName}:`, error);
    return null;
  }
};

// Yeni bir item ekleme
export const addItem = async (collectionName, itemData) => {
  try {
    const directusUrl = process.env.PUBLIC_DIRECTUS_API_URL;
    const directusToken = process.env.PUBLIC_DIRECTUS_API_TOKEN;

    if (!directusUrl || !directusToken) {
      throw new Error("PUBLIC_DIRECTUS_API_URL or PUBLIC_DIRECTUS_API_TOKEN is not defined.");
    }

    const response = await axios.post(`${directusUrl}/items/${collectionName}`, itemData, {
      headers: {
        Authorization: `Bearer ${directusToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error adding item to ${collectionName}:`, error);
    return null;
  }
};

// Mevcut bir item'ı güncelleme
export const updateItem = async (collectionName, itemId, itemData) => {
  try {
    const directusUrl = process.env.PUBLIC_DIRECTUS_API_URL;
    const directusToken = process.env.PUBLIC_DIRECTUS_API_TOKEN;

    if (!directusUrl || !directusToken) {
      throw new Error("PUBLIC_DIRECTUS_API_URL or PUBLIC_DIRECTUS_API_TOKEN is not defined.");
    }

    const response = await axios.patch(`${directusUrl}/items/${collectionName}/${itemId}`, itemData, {
      headers: {
        Authorization: `Bearer ${directusToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating item in ${collectionName} with ID ${itemId}:`, error);
    return null;
  }
};

// Bir item'ı silme
export const deleteItem = async (collectionName, itemId) => {
  try {
    const directusUrl = process.env.PUBLIC_DIRECTUS_API_URL;
    const directusToken = process.env.PUBLIC_DIRECTUS_API_TOKEN;

    if (!directusUrl || !directusToken) {
      throw new Error("PUBLIC_DIRECTUS_API_URL or PUBLIC_DIRECTUS_API_TOKEN is not defined.");
    }

    await axios.delete(`${directusUrl}/items/${collectionName}/${itemId}`, {
      headers: {
        Authorization: `Bearer ${directusToken}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting item from ${collectionName} with ID ${itemId}:`, error);
  }
};

// Tüm item'ları belirli bir filtre ile getirme
export const getItemsByFilter = async (collectionName, filter) => {
  try {
    const directusUrl = process.env.PUBLIC_DIRECTUS_API_URL;
    const directusToken = process.env.PUBLIC_DIRECTUS_API_TOKEN;

    if (!directusUrl || !directusToken) {
      throw new Error("PUBLIC_DIRECTUS_API_URL or PUBLIC_DIRECTUS_API_TOKEN is not defined.");
    }

    const response = await axios.get(`${directusUrl}/items/${collectionName}`, {
      params: {
        filter
      },
      headers: {
        Authorization: `Bearer ${directusToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching items from ${collectionName} with filter:`, error);
    return [];
  }
};
