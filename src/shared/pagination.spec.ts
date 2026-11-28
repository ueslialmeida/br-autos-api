import { ZodError } from 'zod';

import { buildPaginationMeta, paginationQuerySchema } from './pagination';

describe('paginationQuerySchema', () => {
  it('deve aplicar valores padrão quando page e limit não forem informados', () => {
    const parsed = paginationQuerySchema.parse({});

    expect(parsed).toEqual({
      page: 1,
      limit: 20,
    });
  });

  it('deve converter strings numéricas válidas para page e limit', () => {
    const parsed = paginationQuerySchema.parse({
      page: '3',
      limit: '50',
    });

    expect(parsed).toEqual({
      page: 3,
      limit: 50,
    });
  });

  it('deve aceitar os limites mínimos (1) e máximos (100)', () => {
    expect(paginationQuerySchema.parse({ page: '1', limit: '1' })).toEqual({
      page: 1,
      limit: 1,
    });
    expect(paginationQuerySchema.parse({ page: '10', limit: '100' })).toEqual({
      page: 10,
      limit: 100,
    });
  });

  it('deve lançar ZodError quando page for menor que 1 ou não for inteiro', () => {
    expect(() => paginationQuerySchema.parse({ page: '0' })).toThrow(ZodError);
    expect(() => paginationQuerySchema.parse({ page: '-2' })).toThrow(ZodError);
    expect(() => paginationQuerySchema.parse({ page: '1.5' })).toThrow(ZodError);
    expect(() => paginationQuerySchema.parse({ page: 'abc' })).toThrow(ZodError);
  });

  it('deve lançar ZodError quando limit for menor que 1, maior que 100 ou inválido', () => {
    expect(() => paginationQuerySchema.parse({ limit: '0' })).toThrow(ZodError);
    expect(() => paginationQuerySchema.parse({ limit: '-5' })).toThrow(ZodError);
    expect(() => paginationQuerySchema.parse({ limit: '101' })).toThrow(ZodError);
    expect(() => paginationQuerySchema.parse({ limit: '2.5' })).toThrow(ZodError);
    expect(() => paginationQuerySchema.parse({ limit: 'xyz' })).toThrow(ZodError);
  });
});

describe('buildPaginationMeta', () => {
  it('deve retornar metadados zerados quando totalItems for 0', () => {
    const meta = buildPaginationMeta(1, 20, 0);

    expect(meta).toEqual({
      page: 1,
      limit: 20,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('deve calcular corretamente quando todos os itens cabem em uma única página', () => {
    const meta = buildPaginationMeta(1, 20, 15);

    expect(meta).toEqual({
      page: 1,
      limit: 20,
      totalItems: 15,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('deve arredondar totalPages para cima quando houver resto na divisão', () => {
    const meta = buildPaginationMeta(1, 10, 21);

    expect(meta).toEqual({
      page: 1,
      limit: 10,
      totalItems: 21,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('deve marcar hasNextPage e hasPreviousPage como true em uma página intermediária', () => {
    const meta = buildPaginationMeta(2, 10, 25);

    expect(meta).toEqual({
      page: 2,
      limit: 10,
      totalItems: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('deve marcar hasNextPage como false e hasPreviousPage como true na última página', () => {
    const meta = buildPaginationMeta(3, 10, 25);

    expect(meta).toEqual({
      page: 3,
      limit: 10,
      totalItems: 25,
      totalPages: 3,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it('deve manter hasPreviousPage como false se page for 1 mesmo com totalPages maior que 1', () => {
    const meta = buildPaginationMeta(1, 5, 12);

    expect(meta.totalPages).toBe(3);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.hasPreviousPage).toBe(false);
  });
});
