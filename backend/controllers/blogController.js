import blogModel from "../models/blogModel.js";


// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().sort({ createdAt: -1 });
    console.log(blogs);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single blog by slug


export const getBlogById = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    console.log(blog);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create new blog
export const createBlog = async (req, res) => {
  try {
    const blogData = req.body;

    if (req.file) {
      blogData.blogImg = `/uploads/blogs/${req.file.filename}`;
    }

    const newBlog = new blogModel(blogData);
    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const blogData = req.body;

    if (req.file) {
      blogData.blogImg = `/uploads/blogs/${req.file.filename}`;
    }

    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.params.id,
      blogData,
      { new: true }
    );

    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });

    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
