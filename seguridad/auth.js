// seguridad/auth.js
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  // 1) Intentar por query ?token=  (lo dejas por compatibilidad)
  let token = req.query.token;

  // 2) Si no vino por query, intentarlo por el header Authorization
  if (!token) {
    const authHeader = req.headers['authorization']; // headers siempre en minúscula en Node
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7); // quitar 'Bearer '
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET); // usa la misma clave que en login
    req.usuarioId = decoded.id;
    return next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verificarToken };

