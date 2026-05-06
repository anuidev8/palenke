-- Reglamentos / CC Mayor de Capitanía: "Capitanía" is not a municipal seat; location is Páez (Cauca).
-- Keeps the reglamento + actas in the same folder with a single consistent ubicación in the tree UI.

update public.documents
set
  territory = 'Municipio de Páez, Departamento del Cauca',
  municipality = null,
  department = null
where instrument = 'reglamentos'
  and storage_path like 'reglamentos/cc-mayor-de-capitania/%';
