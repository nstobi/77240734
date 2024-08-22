<template>
  <div id="app">
    <div class="container">
      <h1>URL Shortener</h1>
      <div class="form-group">
        <input v-model="originalUrl" class="url-input" placeholder="Enter URL" />
        <button @click="shortenUrl" class="shorten-button">Shorten</button>
      </div>
      <div v-if="shortUrl" class="result">
        Shortened URL: <a :href="shortUrl" target="_blank" class="short-url">{{ shortUrl }}</a>
      </div>
      <!-- Table to display URLs -->
      <div v-if="urls.length">
        <h2>Shortened URLs</h2>
        <table>
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Shortened URL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(url, index) in urls" :key="index">
              <td>{{ url.originalUrl }}</td>
              <td><a :href="url.shortUrl" target="_blank" class="short-url">{{ url.shortUrl }}</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      originalUrl: '',
      shortUrl: '',
      urls: []  // Array to store the list of URLs
    };
  },
  methods: {
    async shortenUrl() {
      try {
        // Send request to shorten URL
        const response = await axios.post('http://localhost:3000/shorten', { originalUrl: this.originalUrl });
        this.shortUrl = response.data.shortUrl;
        
        // Clear the input
        this.originalUrl = '';

        // Fetch and update the list of URLs
        await this.fetchUrls();
      } catch (error) {
        console.error('Error shortening URL:', error.message);
      }
    },
    async fetchUrls() {
      try {
        const response = await axios.get('http://localhost:3000/urls');
        this.urls = response.data;
      } catch (error) {
        console.error('Error fetching URLs:', error.message);
      }
    }
  },
  async created() {
    // Fetch existing URLs when the component is created
    await this.fetchUrls();
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

.container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

h2 {
  color: #333;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.url-input {
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.shorten-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.shorten-button:hover {
  background-color: #0056b3;
}

.result {
  margin-top: 20px;
}

.short-url {
  color: #007bff;
  text-decoration: none;
}

.short-url:hover {
  text-decoration: underline;
}

/* Table styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
