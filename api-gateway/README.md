## ms-api-gateway

Puerta de entrada REST y WebSocket para consumir eventos y videos desde el sistema.

### Características:
- Gestión de usuario.
- Gestión de videos.
- Gestión de preferencias de usuario.

### Estructura:
```
api-gateway/
├── commonsjs/
│   ├── dynamodbjs
│   └── sharedjs
├── lambdas/
│   ├── auth-authorizer
│   ├── auth-login
│   ├── auth-logout
│   ├── users-create
│   └── ...
├── terraform/
│   ├── api-gateway
│   ├── apigateway-resource-auth
│   ├── apigateway-resource-authorizer
│   ├── apigateway-resource-users
│   └── ...
├── main.tf
├── outputs.tf
└── install.sh
```

### Modelo relacional NoSQL

┌────────────┐           ┌────────────┐
│   users    │◄─────────-┤   token    │
│------------│           └────────────┘
│ id (PK)    │           ┌────────────────┐
│ username   │◄─────────-┤  preferences   │
│ password   │           └────────────────┘
│ ...        │────────────┐
└────────────┘            │
                          │
       ▲                  │
       │                  │
┌────────────┐     ┌─────────────┐
│  video     │     │  cameras    │
└────────────┘     └─────────────┘

### Descripción de tablas
```sql
preferences
{
  "PK": "USER#<userId>",
  "SK": "PREFS",
  "notificationsEnabled": true,                       // ¿Recibir notificaciones?
  "notificationsChannels": ["email", "app", "SMS"],   // Canales activos
  "alertSensitivity": "medium",                       // Sensibilidad a detecciones
  "timezone": "America/Bogota",                       // Zona horaria preferida
  "defaultCameraView": "grid",                        // Estilo de vista (grid, lista)
  "defaultSort": "last_activity",                     // Orden de cámaras o videos
  "preferredResolution": "640x480",                   // Resolución sugerida
  "receiveCriticalAlerts": true,                      // Alertas urgentes sí/no
  "videoFormat": "mp4",
  "saveRecordings": true,
  "storageStrategy": "s3",                      // "local" o "s3"
  "localConfig": {
    "storagePath": "/var/videos",               // Ruta local
    "maxSizeGb": 10                             // Tamaño máximo en GB
  },
  "s3Config": {
    "bucketName": "celeste-video-bucket",
    "region": "us-west-2",
    "accessKeyId": "AKIAxxxxxx",               // Puede venir encriptado o por secret manager
    "secretAccessKey": "xxxxxxxxxxxx",         // Idem
    "storageClass": "STANDARD",                // Opcional: STANDARD, GLACIER...
  },
  "retentionDays": 30,
  "jpegQuality": 70,
  "compressVideo": true,
  "maxVideoDurationMin": 10,
}

cameras
{
  "PK": "USER#<userId>",
  "SK": "CAMERA#<cameraId>",
  "type": "Camera",
  "id": "<cameraId>",
  "name": "Oficina Principal",                  // Nombre asignado por el usuario
  "ipAddress": "192.168.0.101",                 // IP o URL de acceso
  "location": "Bogotá, Colombia",               // Ubicación física (opcional)
  "enabled": true,                              // ¿Está activa?
  "recordingEnabled": true,                     // ¿Graba videos?
  "motionDetection": true,                      // ¿Detecta movimiento?
  "faceDetection": false,                       // ¿Detecta rostros?
  "lastConnected": "2025-04-14T17:00:00Z",     // Última conexión exitosa
  "isOnline": true,                             // ¿En línea?
  "tags": ["oficina", "seguridad", "principal"],// Etiquetas personalizadas
  "notes": "Cámara en oficina, apuntando a la entrada principal"
}

video
{
  "PK": "USER#<userId>",
  "SK": "VIDEO#<videoId>",
  "type": "Video",
  "id": "<videoId>",
  "cameraId": "<cameraId>",
  "timestamp": "2025-04-14T15:25:00Z",        // Inicio de grabación
  "durationSeconds": 30,                     // Duración del video
  "eventType": "motion_detected",            // Tipo de evento (ej: rostro, movimiento)
  "s3Url": "s3://celeste-videos-bucket/user123/video_001.mp4",
  "previewImageBase64": "<base64-img>",     // Miniatura rápida opcional
  "resolution": "640x480",                    // Resolución usada
  "bitrateKbps": 1000,
  "fps": 10,
  "isFlagged": false,                        // ¿Marcado por el usuario?
  "tags": ["entrada", "día", "movimiento"],   // Etiquetas para búsqueda
  "notes": "Movimiento detectado en la puerta", // Comentario personalizado
  "createdAt": "2025-04-14T15:25:00Z",
  "updatedAt": "2025-04-14T15:26:00Z"
}




```

### Variables de entorno:
- ENVIRONMENT
- LOGGER_LEVEL
- AWS_REGION
- APP_NAME
- JTW_SECRET_VALUE
- JWT_TOKEN_LIFE

## Pasos e instalación
1. Ejecutar el archivo install.sh
