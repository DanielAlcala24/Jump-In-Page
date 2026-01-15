# Configuración de Supabase para Gestión de Usuarios

## Pasos a seguir en Supabase

### 1. Obtener la Service Role Key

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **Settings** → **API**
3. En la sección **Project API keys**, copia la **`service_role`** key (⚠️ **NUNCA** la expongas en el cliente)
4. Agrega esta variable de entorno en tu archivo `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### 2. Configurar el correo de invitación

1. Ve a **Authentication** → **Email Templates**
2. Selecciona la plantilla **"Invite user"**
3. Personaliza el correo si lo deseas. El enlace de invitación se inserta automáticamente con `{{ .ConfirmationURL }}`
4. Asegúrate de que el **Redirect URL** esté configurado correctamente:
   - Ve a **Authentication** → **URL Configuration**
   - En **Redirect URLs**, agrega: `http://localhost:9002/admin/set-password` (para desarrollo)
   - Y tu URL de producción: `https://tu-dominio.com/admin/set-password`

### 3. Configurar variables de entorno

En tu archivo `.env.local`, asegúrate de tener:

```env
# Variables existentes
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# Nueva variable (solo en el servidor)
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# URL del sitio (para los enlaces de redirección)
NEXT_PUBLIC_SITE_URL=http://localhost:9002
# En producción: NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

### 4. Configurar políticas de seguridad (opcional pero recomendado)

Si quieres restringir quién puede invitar usuarios, puedes crear una función en Supabase:

1. Ve a **SQL Editor** en Supabase
2. Ejecuta el siguiente SQL para crear una función que verifique si un usuario es admin:

```sql
-- Crear función para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Aquí puedes agregar lógica personalizada
  -- Por ejemplo, verificar en una tabla de roles
  -- Por ahora, retornamos true para todos los usuarios autenticados
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5. Configurar el proveedor de correo (si no está configurado)

1. Ve a **Authentication** → **Providers**
2. Asegúrate de que **Email** esté habilitado
3. Si usas un proveedor de correo personalizado (SendGrid, Mailgun, etc.):
   - Ve a **Settings** → **Auth**
   - Configura **SMTP Settings** con tus credenciales

### 6. Probar la funcionalidad

1. Inicia sesión en el panel de administración
2. Ve a **Usuarios** en el menú
3. Haz clic en **Invitar Usuario**
4. Ingresa un correo electrónico
5. El usuario recibirá un correo con el enlace de invitación
6. Al hacer clic en el enlace, será redirigido a `/admin/set-password`
7. Podrá establecer su contraseña y luego iniciar sesión

## Notas importantes

- ⚠️ **NUNCA** expongas la `SUPABASE_SERVICE_ROLE_KEY` en el código del cliente
- La Service Role Key tiene permisos completos, úsala solo en API routes del servidor
- Los enlaces de invitación expiran después de cierto tiempo (configurable en Supabase)
- Asegúrate de que `NEXT_PUBLIC_SITE_URL` esté configurado correctamente para producción

## Solución de problemas

### El correo no llega
- Verifica la configuración SMTP en Supabase
- Revisa la carpeta de spam
- Verifica que el correo esté bien escrito

### Error 401 al invitar usuarios
- Verifica que `SUPABASE_SERVICE_ROLE_KEY` esté configurada correctamente
- Asegúrate de que la variable esté en `.env.local` (no en `.env`)

### El enlace de invitación no funciona
- Verifica que la URL de redirección esté en la lista de URLs permitidas en Supabase
- Asegúrate de que `NEXT_PUBLIC_SITE_URL` esté configurada correctamente
