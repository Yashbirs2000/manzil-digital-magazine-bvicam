import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const axiosInstance = axios.create({
  baseURL: API_URL,
});

const getUrl = (url) => {
  console.log("Generated URL:", url);
  return url ? `${STRAPI_URL}${url}` : null;
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/local/register', {
      username: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const { jwt, user } = response.data;
    if (jwt) {
      return {
        success: true,
        message: 'Registration successful!',
        token: jwt,
        user,
      };
    }

    return { success: false, message: 'Registration failed. Try again!' };
  } catch (error) {
    console.error('❌ Error registering user:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.error?.message || 'An error occurred during registration!',
    };
  }
};

// Secure Login
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/local', {
      identifier: email,
      password,
    });

    const { jwt, user } = response.data;
    if (jwt) {
      return {
        success: true,
        message: 'Login successful!',
        token: jwt,
        user,
      };
    }

    return { success: false, message: 'Invalid email or password!' };
  } catch (error) {
    console.error('❌ Error logging in:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.error?.message || 'An error occurred during login!',
    };
  }
};







// Fetch Articles
export const fetchArticles = async () => {
  try {
    const response = await axiosInstance.get('/articles?populate=*');
    if (response?.data?.data) {
      return response.data.data.map((article) => {
        const { attributes } = article;
        const imageUrl = getUrl(attributes.Image?.data?.[0]?.attributes?.url);
        const content = attributes.Content?.map((block) => block.children?.[0]?.text || '').join(' ') || 'No content available';

        return {
          id: article.id,
          title: attributes.Title || 'No Title',
          description: attributes.Description || 'No description available',
          content,
          publishedDate: attributes.PublishedDate || 'Unknown date',
          image: imageUrl || 'No image available',
        };
      });
    } else {
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching articles:', error);
    return [];
  }
};










// Fetch Magazines
export const fetchMagazines = async () => {
  try {
    const response = await axiosInstance.get('/magazines?populate=*');
    console.log("Fetched magazines data:", response.data);

    if (response?.data?.data) {
      return response.data.data.map((item) => {
        console.log("Item attributes:", item.attributes);

        const coverImageUrl = getUrl(item.attributes.CoverImage?.data?.attributes?.url);
        const pdfFileUrl = getUrl(item.attributes.Ebook?.data?.attributes?.url);
        const categoryName = item.attributes.category?.data?.attributes?.name || 'Uncategorized';

        console.log("Generated cover URL:", coverImageUrl);
        console.log("Generated PDF URL:", pdfFileUrl);
        console.log("Category:", categoryName);

        return {
          id: item.id,
          title: item.attributes.Title || 'No Title',
          cover: coverImageUrl || 'No image available',
          pdf: pdfFileUrl || 'No PDF available',
          category: categoryName,
        };
      });
    } else {
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching magazines:', error);
    return [];
  }
};















// ✅ Fetch Events (Fixed)
export const fetchEvent = async () => {
  try {
    const response = await axiosInstance.get('/events?populate=*');
    console.log("Fetched events data:", response.data);

    if (response?.data?.data) {
      return response.data.data.map((event) => {
        console.log("Event attributes:", event.attributes);

        const imageUrl = getUrl(event.attributes.Image?.data?.attributes?.url);
        const link = event.attributes.Link || '';

        console.log("Generated event image URL:", imageUrl);

        return {
          id: event.id,
          title: event.attributes.Title || 'No Title',
          date: event.attributes.Date || 'Date not available',
          description: event.attributes.Description || 'No description available',
          image: imageUrl || 'No image available',
          link: link || '',
        };
      });
    } else {
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    return [];
  }
};

// Submit Contact Message
export const submitContactMessage = async (formData) => {
  try {
    const response = await axiosInstance.post('/contactmessage', {
      data: formData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error submitting contact message:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.error?.message || 'An error occurred while submitting your message.',
    };
  }
};
