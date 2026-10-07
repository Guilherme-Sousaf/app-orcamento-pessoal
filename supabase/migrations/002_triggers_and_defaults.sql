-- ==============================================================================
-- ORÇA+ : TRIGGERS E CRIAÇÃO AUTOMÁTICA DE DADOS PADRÃO (ON SIGNUP)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Criar Perfil
    INSERT INTO public.profiles (id, full_name, currency)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'BRL'
    );

    -- 2. Criar Conta Padrão Inicial
    INSERT INTO public.accounts (user_id, name, type, initial_balance, color)
    VALUES (
        NEW.id,
        'Conta Principal',
        'checking',
        0.00,
        '#3b82f6'
    );

    -- 3. Criar Categorias Padrão de Despesas
    INSERT INTO public.categories (user_id, name, type, icon, color) VALUES
        (NEW.id, 'Alimentação', 'expense', 'Utensils', '#ef4444'),
        (NEW.id, 'Moradia', 'expense', 'Home', '#f97316'),
        (NEW.id, 'Transporte', 'expense', 'Car', '#eab308'),
        (NEW.id, 'Saúde', 'expense', 'HeartPulse', '#ec4899'),
        (NEW.id, 'Lazer', 'expense', 'Gamepad2', '#8b5cf6'),
        (NEW.id, 'Educação', 'expense', 'GraduationCap', '#06b6d4'),
        (NEW.id, 'Contas & Boletos', 'expense', 'FileText', '#64748b'),
        (NEW.id, 'Outras Despesas', 'expense', 'CreditCard', '#94a3b8');

    -- 4. Criar Categorias Padrão de Receitas
    INSERT INTO public.categories (user_id, name, type, icon, color) VALUES
        (NEW.id, 'Salário', 'income', 'Briefcase', '#10b981'),
        (NEW.id, 'Investimentos', 'income', 'TrendingUp', '#059669'),
        (NEW.id, 'Freelance', 'income', 'Laptop', '#14b8a6'),
        (NEW.id, 'Outras Receitas', 'income', 'PlusCircle', '#34d399');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador após inserção no auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
