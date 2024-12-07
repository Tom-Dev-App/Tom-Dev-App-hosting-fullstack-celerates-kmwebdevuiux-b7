const accessTokens = {
  CLIENT: "787383722828",
  ADMIN: "787376522828",
}

export const getRoleByToken = (token) => {
  switch (token) {
    case accessTokens.CLIENT:
      return "client";
    case accessTokens.ADMIN:
      return "admin";
    default:
      return null;
  }
}

export const hasRoleAccess = (requiredRoles = [], accessSecret) => 
  {
    if(!accessSecret) return false
    const userRole = getRoleByToken(accessSecret)
    return requiredRoles.includes(userRole)
  }

export default accessTokens