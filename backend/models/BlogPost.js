import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  author: {
    type: String,
    default: 'Eco Track Team'
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  sourceUrl: {
    type: String,
    default: null
  },
  sourceName: {
    type: String,
    default: null
  },
  isExternal: {
    type: Boolean,
    default: false
  },
  excerpt: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('BlogPost', blogPostSchema);

