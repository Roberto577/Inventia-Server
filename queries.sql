-- Crear bodegas
CREATE TABLE bodegas (
    id SERIAL PRIMARY KEY,                  -- Identificador único de la bodega
    usuario_id INTEGER NOT NULL,            -- Relación con la tabla de usuarios
    nombre VARCHAR(100) NOT NULL,           -- Nombre de la bodega
    ubicacion VARCHAR(255),                 -- Ubicación de la bodega (opcional)
    descripcion TEXT,                       -- Descripción de la bodega (opcional)
    fecha_creacion TIMESTAMP DEFAULT NOW(), -- Fecha de creación
    fecha_actualizacion TIMESTAMP DEFAULT NOW(), -- Fecha de última actualización
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- Crear productos de una bodega
CREATE TABLE productos_bodega (
    id SERIAL PRIMARY KEY,                     -- Identificador único del registro
    bodega_id INTEGER NOT NULL,                -- Relación con la tabla de bodegas
    producto_id INTEGER NOT NULL,              -- Relación con la tabla de productos
    stock INTEGER DEFAULT 0,                   -- Cantidad en inventario
    precio DECIMAL(10, 2) DEFAULT 0.0,         -- Precio del producto en esta bodega
    fecha_creacion TIMESTAMP DEFAULT NOW(),    -- Fecha de creación
    fecha_actualizacion TIMESTAMP DEFAULT NOW(), -- Fecha de última actualización
    CONSTRAINT fk_bodega FOREIGN KEY (bodega_id) REFERENCES bodegas (id) ON DELETE CASCADE,
    CONSTRAINT fk_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
);

-- Crear tabla de movimientos de los productos de tu bodega
CREATE TABLE movimientos_productos_bodega (
    id SERIAL PRIMARY KEY,                      -- Identificador único del movimiento
    producto_bodega_id INTEGER NOT NULL,        -- Relación con la tabla productos_bodega
    tipo_movimiento VARCHAR(50) NOT NULL,       -- Tipo de movimiento (entrada, salida, ajuste, reemplazo producto entrante funcionalidad, mover de a bodega, etc.)
    cantidad INTEGER NOT NULL,                  -- Cantidad del movimiento
    fecha_movimiento TIMESTAMP DEFAULT NOW(),   -- Fecha del movimiento
    descripcion TEXT,                           -- Descripción del movimiento (opcional)
    usuario_id INTEGER,                         -- Usuario que realizó el movimiento (opcional)
    CONSTRAINT fk_producto_bodega FOREIGN KEY (producto_bodega_id) REFERENCES productos_bodega (id) ON DELETE CASCADE,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
);

-- tabla para almacenar los vencimiento de productos
CREATE TABLE vencimientos_productos_bodega (
    id SERIAL PRIMARY KEY,                         -- Identificador único del vencimiento
    producto_bodega_id INTEGER NOT NULL,           -- Relación con la tabla productos_bodega
    fecha_vencimiento DATE NOT NULL,               -- Fecha de vencimiento del lote
    cantidad INTEGER NOT NULL,                     -- Cantidad de unidades en este lote
    precio DECIMAL(10, 2) DEFAULT 0.0,             -- Precio del lote (opcional)
    fecha_creacion TIMESTAMP DEFAULT NOW(),        -- Fecha de creación del registro
    CONSTRAINT fk_producto_bodega FOREIGN KEY (producto_bodega_id) REFERENCES productos_bodega (id) ON DELETE CASCADE
);


CREATE TABLE historial_precios_producto_bodega (
    id SERIAL PRIMARY KEY,                      -- Identificador único del registro
    producto_bodega_id INTEGER NOT NULL,        -- Relación con la tabla productos_bodega
    precio_anterior DECIMAL(10, 2),             -- Precio anterior del producto (opcional)
    precio_nuevo DECIMAL(10, 2) NOT NULL,       -- Nuevo precio asignado
    fecha_cambio TIMESTAMP DEFAULT NOW(),       -- Fecha del cambio de precio
    descripcion TEXT,                           -- Razón o detalles del cambio de precio (opcional)
    usuario_id INTEGER,                         -- Usuario que realizó el cambio (opcional)
    CONSTRAINT fk_producto_bodega FOREIGN KEY (producto_bodega_id) REFERENCES productos_bodega (id) ON DELETE CASCADE,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
);

-- para setear el id de la db
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM productos));