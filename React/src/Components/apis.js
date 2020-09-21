const NodeServerDomain = "http://localhost:8000"

export  const APIS = {
    _getCategory :`${NodeServerDomain}/category`,
    _getTags:`${NodeServerDomain}/tags`,
    _getPostByCategory:`${NodeServerDomain}/category/posts`,
    _getPostByTag:`${NodeServerDomain}/tag/posts`
}