const API_BASE_URL = 'https://brasilapi.com.br/api/feriados/v1';

export const feriadosService = {
  async buscarFeriados(ano) {
    try {
      const response = await fetch(`${API_BASE_URL}/${ano}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar feriados');
      }
      
      const feriados = await response.json();
      return feriados;
    } catch (error) {
      console.error('Erro ao buscar feriados:', error);
      throw error;
    }
  },

  verificarFeriado(data, feriados) {
    const dataStr = data.toISOString().split('T')[0];
    return feriados.find(f => f.date === dataStr) || null;
  },

  formatarParaCalendario(feriados) {
    const feriadosMarcados = {};
    
    feriados.forEach(feriado => {
      feriadosMarcados[feriado.date] = {
        marked: true,
        selected: true,
        selectedColor: '#ff5252',
        holiday: true,
        holidayName: feriado.name
      };
    });
    
    return feriadosMarcados;
  }
};