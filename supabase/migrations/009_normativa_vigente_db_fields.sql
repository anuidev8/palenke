alter table public.documents
  add column if not exists territory text,
  add column if not exists department text,
  add column if not exists municipality text;

with normativa_location (
  title,
  territory,
  department,
  municipality
) as (
  values
    ('Ley 70 de 1993', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Decreto 1745 de 1995', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Decreto 1384 de 2023', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Decreto 1396 de 2023', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Decreto 0129 de 2024', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Plan Nacional de Desarrollo 2022-2026 — capítulos étnicos', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Marco Global de Biodiversidad Kunming-Montreal', 'Internacional', 'Quebec', 'Montreal'),
    ('Acuerdo de Escazú — Acceso a la información ambiental', 'Internacional', 'Región Metropolitana', 'Santiago'),
    ('Decenio Internacional para los Afrodescendientes (ONU 2015-2024)', 'Internacional', 'Nueva York', 'Nueva York'),
    ('Acuerdo de París', 'Internacional', 'Île-de-France', 'París'),
    ('Decreto 2613 de 2013 — Espacios de participación', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('CONPES 3660 de 2010 — Política para comunidades afro', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Decreto 3770 de 2008 — Reglamentación de la Comisión Consultiva', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('CONPES 3491 de 2007 — Política para población afrocolombiana', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Declaración y Programa de Acción de Durban (2001)', 'Internacional', 'KwaZulu-Natal', 'Durban'),
    ('Decreto 2248 de 1995 — Comisión Consultiva de Alto Nivel', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Comisión Consultiva de Alto Nivel', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Comisión Pedagógica Nacional', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Convenio sobre Diversidad Biológica (CDB)', 'Internacional', 'Quebec', 'Montreal'),
    ('Convención Marco de Cambio Climático (CMNUCC)', 'Internacional', 'Bonn', 'Bonn'),
    ('Ley 21 de 1991 — Incorporación del Convenio 169 de la OIT', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Espacio Nacional de Consulta Previa', 'Nacional', 'Bogotá D.C.', 'Bogotá'),
    ('Convenio 169 de la OIT — Pueblos Indígenas y Tribales', 'Internacional', 'Ginebra', 'Ginebra'),
    ('Convenio Ramsar sobre Humedales', 'Internacional', 'Mazandarán', 'Ramsar'),
    ('Pacto Internacional de Derechos Civiles y Políticos', 'Internacional', 'Nueva York', 'Nueva York'),
    ('Pacto Internacional de Derechos Económicos, Sociales y Culturales', 'Internacional', 'Nueva York', 'Nueva York'),
    ('Convención Internacional contra la Discriminación Racial', 'Internacional', 'Washington D.C.', 'Washington'),
    ('Declaración Universal de Derechos Humanos', 'Internacional', 'París', 'París')
)
update public.documents as d
set
  territory = l.territory,
  department = l.department,
  municipality = l.municipality
from normativa_location as l
where d.instrument = 'normativa-vigente'
  and (
    d.title = l.title
    or (l.title = 'Decreto 0129 de 2024' and d.title = 'Decreto 129 de 2024')
  );
