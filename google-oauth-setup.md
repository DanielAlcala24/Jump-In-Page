# Inicio de sesión con Google en `/admin`

El panel se entra **solo con Google**, y únicamente con cuentas que ya estén dadas de
alta en Supabase Auth. El formulario de correo/contraseña se quitó.

Estos pasos son de configuración externa (Google Cloud y Supabase); el código ya está
listo y no hay variables de entorno nuevas.

---

## 1. Crear las credenciales en Google Cloud

Consola: <https://console.cloud.google.com>

En la consola nueva, la configuración de OAuth vive en **Google Auth Platform**
(antes se llamaba "Pantalla de consentimiento de OAuth", dentro de APIs y servicios).
Si ves los nombres viejos, el contenido de cada paso es el mismo.

### 1.1 Elegir el proyecto

Menú desplegable de proyectos, arriba a la izquierda. Sirve cualquier proyecto de la
cuenta de Jump-In (puede ser el mismo de Analytics/Tag Manager) o uno nuevo con
**Proyecto nuevo** → nombre `Jump-In` → **Crear**.

Verifica arriba que estás parado en el proyecto correcto antes de seguir.

### 1.2 Configurar la pantalla de consentimiento (solo la primera vez)

Menú lateral → **Google Auth Platform** → **Comenzar**.

1. **Información de la app**
   - Nombre de la app: `Jump-In Admin` (es lo que verá el usuario al entrar)
   - Correo de asistencia: una cuenta `@jumpin.com.mx`
2. **Público / Audience**: elegir **Externo**

   > ⚠️ **No elijas "Interno".** Dos admins usan `@abadimx.com` y uno un Gmail
   > personal: con "Interno" solo entrarían las cuentas `@jumpin.com.mx` y esos tres
   > quedarían bloqueados.

3. **Información de contacto**: un correo para avisos de Google
4. Aceptar la política y **Crear**

### 1.3 Publicar la app

**Google Auth Platform** → **Público / Audience** → botón **Publicar app** →
confirmar. El estado debe quedar en **En producción**.

Si se queda en **Prueba**, solo entran los correos que agregues a mano como usuarios
de prueba y **la sesión caduca a los 7 días**.

Publicar aquí **no dispara la verificación de Google**: eso solo aplica a permisos
sensibles, y Supabase únicamente pide `email`, `profile` y `openid`, que son básicos.

### 1.4 Crear el cliente de OAuth

**Google Auth Platform** → **Clientes** → **Crear cliente**
(ruta vieja: APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth)

- **Tipo de aplicación:** `Aplicación web`
- **Nombre:** `Jump-In Admin` (uso interno, no lo ve nadie)

**URI de redireccionamiento autorizado** — es el campo que importa. Agrega
**exactamente** esta, que es la de Supabase, **no** la de tu sitio:

```
https://pcxunmtwgfechivixjkc.supabase.co/auth/v1/callback
```

Sin barra final, con `https`, sin espacios. Cualquier diferencia produce después un
`Error 400: redirect_uri_mismatch`.

**Orígenes autorizados de JavaScript** — opcionales en este flujo (quien redirige es
Supabase desde su propio dominio, no tu sitio). Agregarlos no estorba:

```
https://www.jumpin.com.mx
https://jumpin.com.mx
http://localhost:9002
```

**Crear**.

### 1.5 Copiar las credenciales

Google muestra el **ID de cliente** y el **Secreto del cliente**.

> El secreto se muestra completo solo en ese momento. Cópialo ya; si lo pierdes,
> entra al cliente y genera uno nuevo.

Los dos valores se pegan en Supabase en el paso 2. Trátalos como contraseñas: no van
al repositorio (el repo es público) ni a un chat.

> Los cambios en Google pueden tardar unos minutos en propagarse. Si el primer intento
> falla con `redirect_uri_mismatch`, espera 5 minutos y reintenta antes de mover nada.

## 2. Activar el proveedor en Supabase

Dashboard de Supabase → proyecto `pcxunmtwgfechivixjkc` → **Authentication** →
**Sign In / Providers** → **Google**:

- Activar el proveedor
- Pegar el **Client ID** y el **Client Secret** del paso anterior
- Guardar

---

## 3. Registrar las URLs de retorno

**Authentication** → **URL Configuration**:

- **Site URL:** `https://www.jumpin.com.mx`
- **Redirect URLs** (agregar las tres):
```
https://www.jumpin.com.mx/api/auth/callback
https://jumpin.com.mx/api/auth/callback
http://localhost:9002/api/auth/callback
```

Sin esto, Supabase rechaza el retorno y el login falla con un error de `redirect_to`.

---

## 4. ⚠️ Apagar el registro automático (paso obligatorio)

**Authentication** → **Sign In / Providers** → sección **Auth Providers** →
desactivar **"Allow new users to sign up"**.

Es la barrera principal: sin ella, **cualquier persona con una cuenta de Google podría
entrar al panel**, porque Supabase da de alta al usuario en su primer inicio de sesión.

El callback (`src/app/api/auth/callback/route.ts`) tiene una segunda verificación que
rechaza cuentas que no estuvieran dadas de alta antes, pero está pensada como red de
seguridad por si este ajuste se reactiva por error, no como la única protección.

---

## 5. Confirmar las cuentas de los admins actuales

Google solo se enlaza con un usuario existente si **el correo de ese usuario ya está
confirmado**. Un admin invitado que nunca abrió su correo de invitación tiene el correo
sin confirmar y no podrá entrar.

Para cada admin en **Authentication → Users**, revisa la columna de confirmación:

- **Confirmado** → puede entrar con Google de inmediato.
- **Sin confirmar** → que abra su correo de invitación y complete `/admin/set-password`
  una vez (la contraseña ya no se usa para entrar, pero ese paso activa la cuenta), o
  confírmalo tú desde el dashboard.

Los correos de Google deben coincidir **exactamente** con los de Supabase.

---

## 6. Dar de alta un admin nuevo

El flujo no cambia: `/admin/usuarios` → invitar por correo → la persona abre la
invitación y completa `/admin/set-password` (eso confirma la cuenta) → a partir de ahí
entra con el botón de Google.

---

## Probar

1. Ventana de incógnito → `https://www.jumpin.com.mx/admin` → redirige a `/admin/login`.
2. **Continuar con Google** → elegir una cuenta de admin → debe caer en `/admin`.
3. Repetir con una cuenta de Google que **no** sea admin → debe regresar al login con
   *"Esa cuenta de Google no tiene acceso al panel"* y **sin** sesión iniciada.
