const checkPermissions = (userPermissions, allowedPermissions) => {
  if (allowedPermissions.length === 0) {
    return true;
  }

  return userPermissions.some((permission) =>
    allowedPermissions.includes(permission)
  );
};

const AccessControl = ({ userPermissions, allowedPermissions, children }) => {
  const permitted = checkPermissions(userPermissions, allowedPermissions);

  if (permitted) {
    return children;
  }

  return null
};

AccessControl.defaultProps = {
  allowedPermissions: [],
  permissions: [],
};

export default AccessControl
