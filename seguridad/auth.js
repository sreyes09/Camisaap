const jwt = require( 'jsonwebtoken');

// Middleware para verificar JWT
function verificarToken(req, res, next) {
  const token = req.query.token || req.headers['authorization'].split(' ')[1]; 
  console.log(token) 
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  //const token = authHeader.split(' ')[1];  // Espera formato "Bearer token"
  try {
    const decoded = jwt.verify(token, 'SECRETO_SUPER_SEGUR0');    // Verifica y decodifica el token
    req.usuarioId = decoded.id;                    // Guardamos el id del token en la request para usarlo después
    next();                                       // Token válido, continuar a la siguiente función
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
module.exports = {verificarToken};