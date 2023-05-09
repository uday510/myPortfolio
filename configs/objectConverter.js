// Remove password field from user object and send response to the user
exports.userObject = (user) => { 
  return {
    _id: user._id,
    name: user.name,
    userId: user.userId,
    email: user.email,
    urlsCreated: user.urlsCreated,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

