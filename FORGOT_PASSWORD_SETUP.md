# 🔑 Configuración de Recuperación de Contraseña

## Configurar Email Templates en Supabase

### 1. Ve a Supabase Dashboard
1. Abre tu proyecto en [supabase.com/dashboard](https://supabase.com/dashboard)
2. Ve a **Authentication** → **Email Templates**
3. Selecciona **"Reset Password"**

### 2. Configurar la URL de Redirección

En el template, verifica que la variable `{{ .SiteURL }}` esté configurada:

**Site URL** (en Project Settings → General):
```
http://localhost:8080
```

Para producción:
```
https://tu-dominio.com
```

### 3. Template de Email (Opcional - Personalizar)

Puedes personalizar el email en **Email Templates → Reset Password**:

```html
<h2>Recuperar Contraseña</h2>
<p>Hola,</p>
<p>Has solicitado recuperar tu contraseña en ESENCIA.</p>
<p>Haz click en el siguiente botón para crear una nueva contraseña:</p>
<p><a href="{{ .ConfirmationURL }}">Resetear Contraseña</a></p>
<p>Este link expira en 1 hora.</p>
<p>Si no solicitaste esto, puedes ignorar este email.</p>
```

### 4. Redirect URLs (IMPORTANTE)

En **Authentication → URL Configuration**, agrega:

**Redirect URLs:**
```
http://localhost:8080/reset-password
http://localhost:8080/**
https://tu-dominio.com/reset-password
https://tu-dominio.com/**
```

---

## 🎯 Cómo Usar

### Recuperar Contraseña

1. **Ve a** `http://localhost:8080/forgot-password`
2. **Ingresa tu email**: `lucasperghersier@gmail.com`
3. **Click en** "Enviar Email de Recuperación"
4. **Revisa tu email** (bandeja de entrada o spam)
5. **Click en el link** del email
6. **Serás redirigido a** `/reset-password`
7. **Ingresa tu nueva contraseña** (mínimo 8 caracteres)
8. **Click en** "Actualizar Contraseña"
9. **¡Listo!** Ya puedes iniciar sesión

---

## 🔍 Verificar Configuración

Ejecuta esto en la consola del navegador para testear:

```javascript
// Test 1: Enviar email de recuperación
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'lucasperghersier@gmail.com',
  { redirectTo: 'http://localhost:8080/reset-password' }
);
console.log('Result:', data, error);

// Test 2: Ver configuración actual
console.log('Site URL:', window.location.origin);
```

---

## ❌ Troubleshooting

### No recibo el email
1. Verifica que el email esté registrado
2. Revisa spam/correo no deseado
3. Verifica que SMTP esté configurado (Supabase lo hace automáticamente)
4. Espera 2-3 minutos

### El link no funciona
1. Verifica que las Redirect URLs estén configuradas
2. El link expira en 1 hora
3. Solo se puede usar una vez

### Error "Invalid token"
1. El token ya se usó
2. El token expiró
3. Solicita un nuevo email de recuperación

---

## 🚀 Mejoras Futuras (Opcional)

### Límite de intentos
```sql
-- Crear tabla para rate limiting
CREATE TABLE password_reset_attempts (
  email TEXT NOT NULL,
  attempted_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT
);

-- Limpiar intentos antiguos cada hora
CREATE OR REPLACE FUNCTION cleanup_reset_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_attempts
  WHERE attempted_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
```

### Notificar cambio de contraseña
```typescript
// Después de actualizar la contraseña
await supabase.functions.invoke('send-password-changed-email', {
  body: { userId: user.id }
});
```

---

## 📱 Testing en Producción

1. Asegúrate de agregar tu dominio en **Redirect URLs**
2. Actualiza `Site URL` con tu dominio de producción
3. Prueba el flujo completo antes del lanzamiento

