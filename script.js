window.onload = function () {
  const mailingFilter = document.getElementById('mailing');
  const generalFilter = document.getElementById('general');
  const mediaTypeFilter = document.getElementById('type');
  const regionalFilter = document.getElementById('regional');
  const tierFilter = document.getElementById('tier');
  const noNoticesMessage = document.getElementById('no-notices-message'); // Mensagem para nenhuma matéria encontrada

  // Função para formatar o valor do mailing para a URL (categoria-abcd)
  function formatCategoryForURL(category) {
    return category.toLowerCase().replace(/\s+/g, '-');
  }

  // Função que popula um select com categorias únicas e exibe o valor formatado
  function populateSelect(selectElement, dataAttribute, placeholder) {
    const notices = document.querySelectorAll('.notice');
    const categories = new Set();

    notices.forEach(notice => {
      const category = notice.getAttribute(dataAttribute);
      if (category) {
        categories.add(category); // Mantemos o valor legível para exibição
      }
    });

    // Limpa o select antes de popular e adiciona uma opção padrão específica
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;

    // Adiciona as opções ao select
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = formatCategoryForURL(category); // Valor formatado para URL
      option.textContent = category; // Exibe o valor original
      selectElement.appendChild(option);
    });
  }

  // Atualiza a URL com os parâmetros de filtro
  function updateURL() {
    const urlParams = new URLSearchParams();

    if (mailingFilter.value) urlParams.set('mailing', mailingFilter.value);
    if (generalFilter.value) urlParams.set('general', generalFilter.value);
    if (mediaTypeFilter.value) urlParams.set('type', mediaTypeFilter.value);
    if (regionalFilter.value) urlParams.set('regional', regionalFilter.value);
    if (tierFilter.value) urlParams.set('tier', tierFilter.value);

    // Atualiza a URL sem recarregar a página
    window.history.pushState({}, '', `${window.location.pathname}?${urlParams}`);
    
    // Aplica os filtros
    applyFilters();
  }

  // Função que lida com a exibição dos divisores entre as notícias
  function handleDividers() {
    const notices = document.querySelectorAll('.notice');
    const dividers = document.querySelectorAll('.divider'); // Assumindo que os divisores tenham a classe 'divider'

    let lastVisibleNotice = null;

    dividers.forEach((divider, index) => {
      const previousNotice = notices[index];
      const nextNotice = notices[index + 1];

      const isPreviousVisible = previousNotice && previousNotice.style.display !== 'none';
      const isNextVisible = nextNotice && nextNotice.style.display !== 'none';

      if (isPreviousVisible && isNextVisible) {
        divider.style.display = 'block';
      } else {
        divider.style.display = 'none';
      }

      lastVisibleNotice = isNextVisible ? nextNotice : lastVisibleNotice;
    });

    if (lastVisibleNotice && lastVisibleNotice.style.display === 'none') {
      const lastDivider = dividers[dividers.length - 1];
      if (lastDivider) {
        lastDivider.style.display = 'none';
      }
    }
  }

  // Função que filtra as notícias com base nos atributos
  function applyFilters() {
    const notices = document.querySelectorAll('.notice');
    const mailingCategory = mailingFilter.value;
    const generalCategory = generalFilter.value;
    const mediaType = mediaTypeFilter.value;
    const regional = regionalFilter.value;
    const tier = tierFilter.value;

    let anyNoticeVisible = false; // Flag para verificar se alguma matéria está visível

    notices.forEach(notice => {
      const noticeMailing = formatCategoryForURL(notice.getAttribute('data-mailing-category'));
      const noticeGeneral = formatCategoryForURL(notice.getAttribute('data-general-category'));
      const noticeMediaType = formatCategoryForURL(notice.getAttribute('data-type'));
      const noticeRegional = formatCategoryForURL(notice.getAttribute('data-regional'));
      const noticeTier = formatCategoryForURL(notice.getAttribute('data-tier'));

      let isVisible = true;

      // Verifica se cada filtro está aplicado e se corresponde aos valores dos dados
      if (mailingCategory && noticeMailing.toLowerCase() !== mailingCategory.toLowerCase()) isVisible = false;
      if (generalCategory && noticeGeneral.toLowerCase() !== generalCategory.toLowerCase()) isVisible = false;
      if (mediaType && noticeMediaType.toLowerCase() !== mediaType.toLowerCase()) isVisible = false;
      if (regional && noticeRegional.toLowerCase() !== regional.toLowerCase()) isVisible = false;
      if (tier && noticeTier.toLowerCase() !== tier.toLowerCase()) isVisible = false;

      // Atualiza a visibilidade da matéria e a flag
      notice.style.display = isVisible ? 'block' : 'none';
      if (isVisible) {
        anyNoticeVisible = true; // Marca que pelo menos uma matéria está visível
      }
    });

    // Lidar com os divisores após aplicar os filtros
    handleDividers();
    
    // Exibe ou oculta a mensagem de "nenhuma matéria encontrada"
    noNoticesMessage.style.display = anyNoticeVisible ? 'none' : 'block';
  }

  // Eventos de mudança nos selects
  mailingFilter.addEventListener('change', updateURL);
  generalFilter.addEventListener('change', updateURL);
  mediaTypeFilter.addEventListener('change', updateURL);
  regionalFilter.addEventListener('change', updateURL);
  tierFilter.addEventListener('change', updateURL);

  // Carrega os filtros da URL ao iniciar a página
  function loadFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // Carrega os valores dos filtros a partir da URL
    mailingFilter.value = urlParams.get('mailing') || '';
    generalFilter.value = urlParams.get('general') || '';
    mediaTypeFilter.value = urlParams.get('type') || '';
    regionalFilter.value = urlParams.get('regional') || '';
    tierFilter.value = urlParams.get('tier') || '';

    // Simula o comportamento de ter mudado o select, aplicando os filtros
    applyFilters();
  }

  // Popula os selects com as categorias de mailing e outras
  populateSelect(mailingFilter, 'data-mailing-category', 'Categorias do Mailling');
  populateSelect(generalFilter, 'data-general-category', 'Categorias gerais');
  populateSelect(mediaTypeFilter, 'data-type', 'Tipo de mídia');
  populateSelect(regionalFilter, 'data-regional', 'Regional');
  populateSelect(tierFilter, 'data-tier', 'Tier');

  // Inicializa a página com os filtros da URL
  loadFiltersFromURL();
};