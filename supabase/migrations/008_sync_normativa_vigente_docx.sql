alter table public.documents
  add column if not exists summary text,
  add column if not exists published_on date,
  add column if not exists external_url text,
  add column if not exists document_type text,
  add column if not exists priority_order integer not null default 0,
  add column if not exists featured boolean not null default false,
  add column if not exists source_label text;

with normativa_seed (
  title,
  council,
  summary,
  published_on,
  external_url,
  document_type,
  priority_order,
  featured,
  source_label,
  storage_path
) as (
  values
    (
      'Ley 70 de 1993',
      'Congreso de Colombia',
      'Norma central que desarrolla el artículo transitorio 55 de la Constitución y reconoce derechos territoriales, culturales, de participación y desarrollo propio de las comunidades negras.',
      date '1993-08-27',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=7388',
      'Ley',
      10,
      true,
      'Función Pública',
      '/docs/normativa/Ley_70_de_1993.pdf'
    ),
    (
      'Decreto 1745 de 1995',
      'Presidencia de la República',
      'Reglamenta el Capítulo III de la Ley 70 de 1993 sobre propiedad colectiva, titulación y funcionamiento de los Consejos Comunitarios.',
      date '1995-10-12',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=7389',
      'Decreto',
      20,
      true,
      'Función Pública',
      null
    ),
    (
      'Decreto 1384 de 2023',
      'Presidencia de la República',
      'Reglamenta el capítulo IV y las disposiciones ambientales de la Ley 70 de 1993 en lo relacionado con recursos naturales renovables y ambiente en territorios colectivos afrodescendientes.',
      date '2023-08-25',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=217070',
      'Decreto',
      30,
      true,
      'Función Pública',
      null
    ),
    (
      'Decreto 1396 de 2023',
      'Presidencia de la República',
      'Reglamenta el Capítulo V de la Ley 70 de 1993 y adopta mecanismos especiales para el fomento y desarrollo de actividades mineras en territorios colectivos afrodescendientes.',
      date '2023-08-25',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=217090',
      'Decreto',
      40,
      true,
      'Función Pública',
      '/docs/normativa/Decreto_1396_de_2023.pdf'
    ),
    (
      'Decreto 0129 de 2024',
      'Presidencia de la República',
      'Reglamenta los procedimientos de ampliación y saneamiento de tierras de comunidades negras y adopta mecanismos para la protección y seguridad jurídica de territorios ocupados ancestral y tradicionalmente.',
      date '2024-02-07',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=229310',
      'Decreto',
      50,
      true,
      'Función Pública',
      '/docs/normativa/Decreto_129_de_2024.pdf'
    ),
    (
      'Plan Nacional de Desarrollo 2022-2026 — capítulos étnicos',
      'Departamento Nacional de Planeación',
      'Documento base del Plan Nacional de Desarrollo con apartados y orientaciones relevantes para pueblos y comunidades étnicas, incluida la agenda afrodescendiente.',
      date '2023-05-19',
      'https://www.cnp.gov.co/Documents/Concepto%20CNP%20BASES%20PND%202022%202026_compressed.pdf',
      'Política pública',
      60,
      false,
      'DNP',
      null
    ),
    (
      'Marco Global de Biodiversidad Kunming-Montreal',
      'Convenio sobre la Diversidad Biológica',
      'Marco internacional de biodiversidad adoptado en la COP15, útil para protección biocultural, conservación y gobernanza territorial.',
      date '2022-12-19',
      'https://www.cbd.int/doc/c/2c37/244c/133052cdb1ff4d5556ffac94/cop-15-l-25-es.pdf',
      'Instrumento internacional',
      70,
      false,
      'CBD',
      null
    ),
    (
      'Acuerdo de Escazú — Acceso a la información ambiental',
      'CEPAL',
      'Tratado regional sobre acceso a la información, participación pública y justicia en asuntos ambientales en América Latina y el Caribe.',
      date '2018-03-04',
      'https://www.dar.org.pe/archivos/publicacion/203_Acuerdo_Escazu.pdf',
      'Instrumento internacional',
      80,
      false,
      'Acuerdo de Escazú',
      null
    ),
    (
      'Decenio Internacional para los Afrodescendientes (ONU 2015-2024)',
      'Naciones Unidas',
      'Marco internacional que orienta acciones de reconocimiento, justicia y desarrollo para los pueblos afrodescendientes.',
      date '2013-12-23',
      'https://acnudh.org/wp-content/uploads/2018/10/15-17877S_African-Descent-Booklet_WEB-ilovepdf-compressed.pdf',
      'Instrumento internacional',
      90,
      false,
      'ACNUDH',
      null
    ),
    (
      'Acuerdo de París',
      'Naciones Unidas',
      'Acuerdo climático global relevante para transición justa, adaptación y salvaguardas ambientales en territorios colectivos.',
      date '2015-12-12',
      'https://archivo.minambiente.gov.co/images/cambioclimatico/pdf/documentos_tecnicos_soporte/As%C3%AD_actuar%C3%A1_Colombia_frente_al_cambio_clim%C3%A1tico.pdf',
      'Instrumento internacional',
      100,
      false,
      'MinAmbiente',
      null
    ),
    (
      'Decreto 2613 de 2013 — Espacios de participación',
      'Presidencia de la República',
      'Fortalece la interlocución y participación institucional de comunidades negras, afrocolombianas, raizales y palenqueras.',
      date '2013-11-20',
      'https://www.minambiente.gov.co/wp-content/uploads/2022/02/decreto-2613-2013.pdf',
      'Decreto',
      110,
      false,
      'MinAmbiente',
      null
    ),
    (
      'CONPES 3660 de 2010 — Política para comunidades afro',
      'Departamento Nacional de Planeación',
      'Lineamientos de política pública para promover oportunidades, inclusión y garantía de derechos de la población afrocolombiana.',
      date '2010-05-10',
      'https://colaboracion.dnp.gov.co/CDT/Conpes/Econ%C3%B3micos/3660.pdf',
      'Política pública',
      120,
      false,
      'DNP',
      null
    ),
    (
      'Decreto 3770 de 2008 — Reglamentación de la Comisión Consultiva',
      'Presidencia de la República',
      'Reglamenta la Comisión Consultiva de Alto Nivel y el registro de Consejos Comunitarios y organizaciones de comunidades negras.',
      date '2008-09-25',
      'https://www.ramajudicial.gov.co/documents/10635/132404628/Decreto+3770+de+2008.pdf/afb461ee-0ac7-3226-506f-0fbf2afb3594?t=1678962850681',
      'Decreto',
      130,
      false,
      'Rama Judicial',
      null
    ),
    (
      'CONPES 3491 de 2007 — Política para población afrocolombiana',
      'Departamento Nacional de Planeación',
      'Documento CONPES que orienta acciones estatales para mejorar condiciones de vida y cerrar brechas para la población afrocolombiana.',
      date '2007-10-01',
      'https://colaboracion.dnp.gov.co/CDT/Conpes/Econ%C3%B3micos/3491.pdf',
      'Política pública',
      140,
      false,
      'DNP',
      null
    ),
    (
      'Declaración y Programa de Acción de Durban (2001)',
      'Naciones Unidas',
      'Marco internacional contra el racismo, la discriminación racial, la xenofobia y formas conexas de intolerancia.',
      date '2001-09-08',
      'https://www.ohchr.org/sites/default/files/Documents/Publications/DurbanDecProgAction_sp.pdf',
      'Instrumento internacional',
      150,
      false,
      'ACNUDH',
      null
    ),
    (
      'Decreto 2248 de 1995 — Comisión Consultiva de Alto Nivel',
      'Presidencia de la República',
      'Reglamenta la conformación inicial de la Comisión Consultiva de Alto Nivel para las comunidades negras.',
      date '1995-12-22',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=7390',
      'Decreto',
      160,
      false,
      'Función Pública',
      null
    ),
    (
      'Comisión Consultiva de Alto Nivel',
      'Presidencia de la República',
      'Referencia institucional oficial sobre la Comisión Consultiva de Alto Nivel y su marco de funcionamiento.',
      date '2020-01-01',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=151246',
      'Instancia oficial',
      170,
      false,
      'Función Pública',
      null
    ),
    (
      'Comisión Pedagógica Nacional',
      'Presidencia de la República',
      'Marco institucional de la Comisión Pedagógica Nacional para comunidades negras, afrocolombianas, raizales y palenqueras.',
      date '2015-01-01',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=66719',
      'Instancia oficial',
      180,
      false,
      'Función Pública',
      null
    ),
    (
      'Convenio sobre Diversidad Biológica (CDB)',
      'Naciones Unidas',
      'Convenio internacional sobre conservación de la diversidad biológica, uso sostenible y participación justa en beneficios.',
      date '1992-06-05',
      'https://www.cbd.int/undb/media/factsheets/undb-factsheets-es-web.pdf',
      'Instrumento internacional',
      190,
      false,
      'CBD',
      null
    ),
    (
      'Convención Marco de Cambio Climático (CMNUCC)',
      'Naciones Unidas',
      'Convención marco que orienta la acción climática internacional y las obligaciones estatales en mitigación y adaptación.',
      date '1992-05-09',
      'https://unfccc.int/resource/docs/convkp/convsp.pdf',
      'Instrumento internacional',
      200,
      false,
      'UNFCCC',
      null
    ),
    (
      'Ley 21 de 1991 — Incorporación del Convenio 169 de la OIT',
      'Congreso de Colombia',
      'Aprueba el Convenio 169 de la OIT e incorpora al ordenamiento colombiano garantías sobre territorio, consulta previa y autonomía de pueblos étnicos.',
      date '1991-03-04',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=37032',
      'Ley',
      210,
      false,
      'Función Pública',
      null
    ),
    (
      'Espacio Nacional de Consulta Previa',
      'Presidencia de la República',
      'Marco institucional oficial para la consulta previa y la interlocución con pueblos y comunidades étnicas.',
      date '2016-01-01',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=87801',
      'Instancia oficial',
      220,
      false,
      'Función Pública',
      null
    ),
    (
      'Convenio 169 de la OIT — Pueblos Indígenas y Tribales',
      'Organización Internacional del Trabajo',
      'Convenio internacional de referencia para consulta previa, territorio y autodeterminación de pueblos indígenas y tribales, aplicable por bloque de constitucionalidad.',
      date '1989-06-27',
      'https://www.ilo.org/dyn/normlex/es/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C169',
      'Instrumento internacional',
      230,
      false,
      'OIT',
      null
    ),
    (
      'Convenio Ramsar sobre Humedales',
      'Convención Ramsar',
      'Tratado internacional para la conservación y uso racional de humedales de importancia internacional.',
      date '1971-02-02',
      'https://www.miteco.gob.es/content/dam/miteco/es/biodiversidad/temas/ecosistemas-y-conectividad/leg_texto_convenio_ramsar_tcm30-196467.pdf',
      'Instrumento internacional',
      240,
      false,
      'Ramsar',
      null
    ),
    (
      'Pacto Internacional de Derechos Civiles y Políticos',
      'Naciones Unidas',
      'Instrumento internacional sobre libertades fundamentales, participación política y garantías judiciales.',
      date '1966-12-16',
      'https://www.fiscalia.gov.co/colombia/wp-content/uploads/2012/05/Pacto-Internacional-de-Derechos-Civiles-y-Pol%C3%ADticos.pdf',
      'Instrumento internacional',
      250,
      false,
      'Naciones Unidas',
      null
    ),
    (
      'Pacto Internacional de Derechos Económicos, Sociales y Culturales',
      'Naciones Unidas',
      'Instrumento internacional que protege derechos a salud, educación, trabajo, cultura y desarrollo con enfoque de progresividad.',
      date '1966-12-16',
      'https://www.ohchr.org/sites/default/files/Documents/ProfessionalInterest/cescr_SP.pdf',
      'Instrumento internacional',
      260,
      false,
      'ACNUDH',
      null
    ),
    (
      'Convención Internacional contra la Discriminación Racial',
      'Organización de los Estados Americanos',
      'Instrumento internacional para prevenir, sancionar y erradicar el racismo y la discriminación racial.',
      date '1965-12-21',
      'https://www.oas.org/es/sla/ddi/docs/tratados_multilaterales_interamericanos_A-68_racismo.pdf',
      'Instrumento internacional',
      270,
      false,
      'OEA',
      null
    ),
    (
      'Declaración Universal de Derechos Humanos',
      'Naciones Unidas',
      'Declaración fundacional del sistema internacional de derechos humanos, base para interpretación y protección de derechos colectivos e individuales.',
      date '1948-12-10',
      'https://www.ohchr.org/sites/default/files/Documents/Publications/ABCannexessp.pdf',
      'Instrumento internacional',
      280,
      false,
      'ACNUDH',
      null
    )
)
update public.documents as d
set
  title = s.title,
  council = s.council,
  visibility = 'public',
  summary = s.summary,
  published_on = s.published_on,
  external_url = s.external_url,
  document_type = s.document_type,
  priority_order = s.priority_order,
  featured = s.featured,
  source_label = s.source_label
from normativa_seed as s
where d.instrument = 'normativa-vigente'
  and (
    d.title = s.title
    or (s.title = 'Decreto 0129 de 2024' and d.title = 'Decreto 129 de 2024')
    or (s.storage_path is not null and d.storage_path = s.storage_path)
  );

with normativa_seed (
  title,
  council,
  summary,
  published_on,
  external_url,
  document_type,
  priority_order,
  featured,
  source_label,
  storage_path
) as (
  values
    (
      'Ley 70 de 1993',
      'Congreso de Colombia',
      'Norma central que desarrolla el artículo transitorio 55 de la Constitución y reconoce derechos territoriales, culturales, de participación y desarrollo propio de las comunidades negras.',
      date '1993-08-27',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=7388',
      'Ley',
      10,
      true,
      'Función Pública',
      '/docs/normativa/Ley_70_de_1993.pdf'
    ),
    (
      'Decreto 1745 de 1995',
      'Presidencia de la República',
      'Reglamenta el Capítulo III de la Ley 70 de 1993 sobre propiedad colectiva, titulación y funcionamiento de los Consejos Comunitarios.',
      date '1995-10-12',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=7389',
      'Decreto',
      20,
      true,
      'Función Pública',
      null
    ),
    (
      'Decreto 1384 de 2023',
      'Presidencia de la República',
      'Reglamenta el capítulo IV y las disposiciones ambientales de la Ley 70 de 1993 en lo relacionado con recursos naturales renovables y ambiente en territorios colectivos afrodescendientes.',
      date '2023-08-25',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=217070',
      'Decreto',
      30,
      true,
      'Función Pública',
      null
    ),
    (
      'Decreto 1396 de 2023',
      'Presidencia de la República',
      'Reglamenta el Capítulo V de la Ley 70 de 1993 y adopta mecanismos especiales para el fomento y desarrollo de actividades mineras en territorios colectivos afrodescendientes.',
      date '2023-08-25',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=217090',
      'Decreto',
      40,
      true,
      'Función Pública',
      '/docs/normativa/Decreto_1396_de_2023.pdf'
    ),
    (
      'Decreto 0129 de 2024',
      'Presidencia de la República',
      'Reglamenta los procedimientos de ampliación y saneamiento de tierras de comunidades negras y adopta mecanismos para la protección y seguridad jurídica de territorios ocupados ancestral y tradicionalmente.',
      date '2024-02-07',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=229310',
      'Decreto',
      50,
      true,
      'Función Pública',
      '/docs/normativa/Decreto_129_de_2024.pdf'
    ),
    (
      'Plan Nacional de Desarrollo 2022-2026 — capítulos étnicos',
      'Departamento Nacional de Planeación',
      'Documento base del Plan Nacional de Desarrollo con apartados y orientaciones relevantes para pueblos y comunidades étnicas, incluida la agenda afrodescendiente.',
      date '2023-05-19',
      'https://www.cnp.gov.co/Documents/Concepto%20CNP%20BASES%20PND%202022%202026_compressed.pdf',
      'Política pública',
      60,
      false,
      'DNP',
      null
    ),
    (
      'Marco Global de Biodiversidad Kunming-Montreal',
      'Convenio sobre la Diversidad Biológica',
      'Marco internacional de biodiversidad adoptado en la COP15, útil para protección biocultural, conservación y gobernanza territorial.',
      date '2022-12-19',
      'https://www.cbd.int/doc/c/2c37/244c/133052cdb1ff4d5556ffac94/cop-15-l-25-es.pdf',
      'Instrumento internacional',
      70,
      false,
      'CBD',
      null
    ),
    (
      'Acuerdo de Escazú — Acceso a la información ambiental',
      'CEPAL',
      'Tratado regional sobre acceso a la información, participación pública y justicia en asuntos ambientales en América Latina y el Caribe.',
      date '2018-03-04',
      'https://www.dar.org.pe/archivos/publicacion/203_Acuerdo_Escazu.pdf',
      'Instrumento internacional',
      80,
      false,
      'Acuerdo de Escazú',
      null
    ),
    (
      'Decenio Internacional para los Afrodescendientes (ONU 2015-2024)',
      'Naciones Unidas',
      'Marco internacional que orienta acciones de reconocimiento, justicia y desarrollo para los pueblos afrodescendientes.',
      date '2013-12-23',
      'https://acnudh.org/wp-content/uploads/2018/10/15-17877S_African-Descent-Booklet_WEB-ilovepdf-compressed.pdf',
      'Instrumento internacional',
      90,
      false,
      'ACNUDH',
      null
    ),
    (
      'Acuerdo de París',
      'Naciones Unidas',
      'Acuerdo climático global relevante para transición justa, adaptación y salvaguardas ambientales en territorios colectivos.',
      date '2015-12-12',
      'https://archivo.minambiente.gov.co/images/cambioclimatico/pdf/documentos_tecnicos_soporte/As%C3%AD_actuar%C3%A1_Colombia_frente_al_cambio_clim%C3%A1tico.pdf',
      'Instrumento internacional',
      100,
      false,
      'MinAmbiente',
      null
    ),
    (
      'Decreto 2613 de 2013 — Espacios de participación',
      'Presidencia de la República',
      'Fortalece la interlocución y participación institucional de comunidades negras, afrocolombianas, raizales y palenqueras.',
      date '2013-11-20',
      'https://www.minambiente.gov.co/wp-content/uploads/2022/02/decreto-2613-2013.pdf',
      'Decreto',
      110,
      false,
      'MinAmbiente',
      null
    ),
    (
      'CONPES 3660 de 2010 — Política para comunidades afro',
      'Departamento Nacional de Planeación',
      'Lineamientos de política pública para promover oportunidades, inclusión y garantía de derechos de la población afrocolombiana.',
      date '2010-05-10',
      'https://colaboracion.dnp.gov.co/CDT/Conpes/Econ%C3%B3micos/3660.pdf',
      'Política pública',
      120,
      false,
      'DNP',
      null
    ),
    (
      'Decreto 3770 de 2008 — Reglamentación de la Comisión Consultiva',
      'Presidencia de la República',
      'Reglamenta la Comisión Consultiva de Alto Nivel y el registro de Consejos Comunitarios y organizaciones de comunidades negras.',
      date '2008-09-25',
      'https://www.ramajudicial.gov.co/documents/10635/132404628/Decreto+3770+de+2008.pdf/afb461ee-0ac7-3226-506f-0fbf2afb3594?t=1678962850681',
      'Decreto',
      130,
      false,
      'Rama Judicial',
      null
    ),
    (
      'CONPES 3491 de 2007 — Política para población afrocolombiana',
      'Departamento Nacional de Planeación',
      'Documento CONPES que orienta acciones estatales para mejorar condiciones de vida y cerrar brechas para la población afrocolombiana.',
      date '2007-10-01',
      'https://colaboracion.dnp.gov.co/CDT/Conpes/Econ%C3%B3micos/3491.pdf',
      'Política pública',
      140,
      false,
      'DNP',
      null
    ),
    (
      'Declaración y Programa de Acción de Durban (2001)',
      'Naciones Unidas',
      'Marco internacional contra el racismo, la discriminación racial, la xenofobia y formas conexas de intolerancia.',
      date '2001-09-08',
      'https://www.ohchr.org/sites/default/files/Documents/Publications/DurbanDecProgAction_sp.pdf',
      'Instrumento internacional',
      150,
      false,
      'ACNUDH',
      null
    ),
    (
      'Decreto 2248 de 1995 — Comisión Consultiva de Alto Nivel',
      'Presidencia de la República',
      'Reglamenta la conformación inicial de la Comisión Consultiva de Alto Nivel para las comunidades negras.',
      date '1995-12-22',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=7390',
      'Decreto',
      160,
      false,
      'Función Pública',
      null
    ),
    (
      'Comisión Consultiva de Alto Nivel',
      'Presidencia de la República',
      'Referencia institucional oficial sobre la Comisión Consultiva de Alto Nivel y su marco de funcionamiento.',
      date '2020-01-01',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=151246',
      'Instancia oficial',
      170,
      false,
      'Función Pública',
      null
    ),
    (
      'Comisión Pedagógica Nacional',
      'Presidencia de la República',
      'Marco institucional de la Comisión Pedagógica Nacional para comunidades negras, afrocolombianas, raizales y palenqueras.',
      date '2015-01-01',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=66719',
      'Instancia oficial',
      180,
      false,
      'Función Pública',
      null
    ),
    (
      'Convenio sobre Diversidad Biológica (CDB)',
      'Naciones Unidas',
      'Convenio internacional sobre conservación de la diversidad biológica, uso sostenible y participación justa en beneficios.',
      date '1992-06-05',
      'https://www.cbd.int/undb/media/factsheets/undb-factsheets-es-web.pdf',
      'Instrumento internacional',
      190,
      false,
      'CBD',
      null
    ),
    (
      'Convención Marco de Cambio Climático (CMNUCC)',
      'Naciones Unidas',
      'Convención marco que orienta la acción climática internacional y las obligaciones estatales en mitigación y adaptación.',
      date '1992-05-09',
      'https://unfccc.int/resource/docs/convkp/convsp.pdf',
      'Instrumento internacional',
      200,
      false,
      'UNFCCC',
      null
    ),
    (
      'Ley 21 de 1991 — Incorporación del Convenio 169 de la OIT',
      'Congreso de Colombia',
      'Aprueba el Convenio 169 de la OIT e incorpora al ordenamiento colombiano garantías sobre territorio, consulta previa y autonomía de pueblos étnicos.',
      date '1991-03-04',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=37032',
      'Ley',
      210,
      false,
      'Función Pública',
      null
    ),
    (
      'Espacio Nacional de Consulta Previa',
      'Presidencia de la República',
      'Marco institucional oficial para la consulta previa y la interlocución con pueblos y comunidades étnicas.',
      date '2016-01-01',
      'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=87801',
      'Instancia oficial',
      220,
      false,
      'Función Pública',
      null
    ),
    (
      'Convenio 169 de la OIT — Pueblos Indígenas y Tribales',
      'Organización Internacional del Trabajo',
      'Convenio internacional de referencia para consulta previa, territorio y autodeterminación de pueblos indígenas y tribales, aplicable por bloque de constitucionalidad.',
      date '1989-06-27',
      'https://www.ilo.org/dyn/normlex/es/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C169',
      'Instrumento internacional',
      230,
      false,
      'OIT',
      null
    ),
    (
      'Convenio Ramsar sobre Humedales',
      'Convención Ramsar',
      'Tratado internacional para la conservación y uso racional de humedales de importancia internacional.',
      date '1971-02-02',
      'https://www.miteco.gob.es/content/dam/miteco/es/biodiversidad/temas/ecosistemas-y-conectividad/leg_texto_convenio_ramsar_tcm30-196467.pdf',
      'Instrumento internacional',
      240,
      false,
      'Ramsar',
      null
    ),
    (
      'Pacto Internacional de Derechos Civiles y Políticos',
      'Naciones Unidas',
      'Instrumento internacional sobre libertades fundamentales, participación política y garantías judiciales.',
      date '1966-12-16',
      'https://www.fiscalia.gov.co/colombia/wp-content/uploads/2012/05/Pacto-Internacional-de-Derechos-Civiles-y-Pol%C3%ADticos.pdf',
      'Instrumento internacional',
      250,
      false,
      'Naciones Unidas',
      null
    ),
    (
      'Pacto Internacional de Derechos Económicos, Sociales y Culturales',
      'Naciones Unidas',
      'Instrumento internacional que protege derechos a salud, educación, trabajo, cultura y desarrollo con enfoque de progresividad.',
      date '1966-12-16',
      'https://www.ohchr.org/sites/default/files/Documents/ProfessionalInterest/cescr_SP.pdf',
      'Instrumento internacional',
      260,
      false,
      'ACNUDH',
      null
    ),
    (
      'Convención Internacional contra la Discriminación Racial',
      'Organización de los Estados Americanos',
      'Instrumento internacional para prevenir, sancionar y erradicar el racismo y la discriminación racial.',
      date '1965-12-21',
      'https://www.oas.org/es/sla/ddi/docs/tratados_multilaterales_interamericanos_A-68_racismo.pdf',
      'Instrumento internacional',
      270,
      false,
      'OEA',
      null
    ),
    (
      'Declaración Universal de Derechos Humanos',
      'Naciones Unidas',
      'Declaración fundacional del sistema internacional de derechos humanos, base para interpretación y protección de derechos colectivos e individuales.',
      date '1948-12-10',
      'https://www.ohchr.org/sites/default/files/Documents/Publications/ABCannexessp.pdf',
      'Instrumento internacional',
      280,
      false,
      'ACNUDH',
      null
    )
)
insert into public.documents (
  title,
  instrument,
  council,
  visibility,
  storage_bucket,
  storage_path,
  summary,
  published_on,
  external_url,
  document_type,
  priority_order,
  featured,
  source_label
)
select
  s.title,
  'normativa-vigente',
  s.council,
  'public',
  null,
  s.storage_path,
  s.summary,
  s.published_on,
  s.external_url,
  s.document_type,
  s.priority_order,
  s.featured,
  s.source_label
from normativa_seed as s
where not exists (
  select 1
  from public.documents as d
  where d.instrument = 'normativa-vigente'
    and (
      d.title = s.title
      or (s.title = 'Decreto 0129 de 2024' and d.title = 'Decreto 129 de 2024')
      or (s.storage_path is not null and d.storage_path = s.storage_path)
    )
);
