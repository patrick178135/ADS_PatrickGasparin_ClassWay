import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/login';
import UsuarioService from '@/src/services/usuario.service';
import { useRouter } from 'next/router';

// Mock do next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock do UsuarioService
jest.mock('@/src/services/usuario.service', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
  },
}));

describe('Login', () => {
  beforeEach(() => {
    // Limpa mocks antes de cada teste
    jest.clearAllMocks();
  });

  // 🧪 Teste 1 - Renderização da tela
  it('should render the login form correctly', () => {
    render(<Login />);

    expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  // 🧪 Teste 2 - Login falhou (Credenciais inválidas)
  it('should show error message on failed login', async () => {
    (UsuarioService.login as jest.Mock).mockRejectedValueOnce(
      new Error('Credenciais inválidas')
    );

    render(<Login/>);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'teste@teste.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    const errorMessage = await screen.findByText(/credenciais inválidas/i);
    expect(errorMessage).toBeInTheDocument();
  });

  // 🧪 Teste 3 - Login com sucesso e redirecionamento
  it('should login successfully and redirect to home', async () => {
    (UsuarioService.login as jest.Mock).mockResolvedValueOnce({
      accessToken: 'fake-token',
    });

    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@admin.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    const successMessage = await screen.findByText(/login bem-sucedido/i);
    expect(successMessage).toBeInTheDocument();

    expect(mockPush).toHaveBeenCalledWith('/home');
  });
});
