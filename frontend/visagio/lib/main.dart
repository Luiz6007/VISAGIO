import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'supabase_config.dart';

const _paper = Color(0xFFFFFCF7);
const _teal = Color(0xFF006277);
const _tealDark = Color(0xFF004B61);
const _ink = Color(0xFF24344D);
const _muted = Color(0xFF8A93A7);
const _lilac = Color(0xFFA997D4);
const _fieldBorder = Color(0xFFD9CAE9);
const _error = Color(0xFFC84F4F);

final supabase = Supabase.instance.client;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
    url: SupabaseConfig.url,
    anonKey: SupabaseConfig.anonKey,
  );
  runApp(const VisagioApp());
}

class VisagioApp extends StatelessWidget {
  const VisagioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'visagio',
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: _paper,
        colorScheme: ColorScheme.fromSeed(seedColor: _teal),
        fontFamily: 'Roboto',
      ),
      home: const WelcomeScreen(),
    );
  }
}

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _paper,
      body: SafeArea(
        top: false,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const WelcomeHeader(),
            Transform.translate(
              offset: const Offset(0, -18),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(28, 0, 28, 34),
                child: Column(
                  children: [
                    const FaceIllustration(),
                    const SizedBox(height: 24),
                    const Text.rich(
                      TextSpan(
                        text: 'Tecnologia e visagismo\npara ',
                        children: [
                          TextSpan(
                            text: 'valorizar',
                            style: TextStyle(color: _lilac),
                          ),
                          TextSpan(text: ' sua imagem.'),
                        ],
                      ),
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: _ink,
                        fontSize: 22,
                        height: 1.35,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 28),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        PageDot(active: true),
                        SizedBox(width: 16),
                        PageDot(),
                        SizedBox(width: 16),
                        PageDot(),
                      ],
                    ),
                    const SizedBox(height: 28),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: () => Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => const AuthScreen(
                              initialMode: AuthMode.register,
                            ),
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _teal,
                          foregroundColor: Colors.white,
                          elevation: 4,
                          shadowColor: _teal.withOpacity(0.35),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Continuar',
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            SizedBox(width: 42),
                            Icon(Icons.arrow_forward, size: 25),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class WelcomeHeader extends StatelessWidget {
  const WelcomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 342,
      child: Stack(
        children: [
          Positioned.fill(
            child: Container(color: _teal),
          ),
          const Positioned.fill(
            child: CustomPaint(painter: ContourPainter()),
          ),
          const Positioned(
            top: 112,
            left: 0,
            right: 0,
            child: Column(
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Text(
                      'ViSAGiO',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 50,
                        height: 1.05,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1,
                      ),
                    ),
                    Positioned(
                      top: -9,
                      right: 4,
                      child: Icon(
                        Icons.auto_awesome,
                        color: Colors.white,
                        size: 21,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 5),
                Text(
                  'BELEZA COM PROPOSITO',
                  style: TextStyle(
                    color: Color(0xD8FFFFFF),
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2.4,
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: -1,
            child: SizedBox(
              height: 105,
              child: CustomPaint(painter: HeaderWavePainter()),
            ),
          ),
        ],
      ),
    );
  }
}

enum AuthMode { register, login }

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key, required this.initialMode});

  final AuthMode initialMode;

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  late AuthMode _mode;
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirmPassword = TextEditingController();
  bool _loading = false;
  String? _message;
  bool _isError = false;

  bool get _isRegister => _mode == AuthMode.register;

  @override
  void initState() {
    super.initState();
    _mode = widget.initialMode;
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirmPassword.dispose();
    super.dispose();
  }

  void _setMode(AuthMode mode) {
    setState(() {
      _mode = mode;
      _message = null;
      _isError = false;
    });
  }

  void _setMessage(String text, {bool error = false}) {
    setState(() {
      _message = text;
      _isError = error;
    });
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();

    if (_email.text.trim().isEmpty || _password.text.isEmpty) {
      _setMessage('Preencha e-mail e senha.', error: true);
      return;
    }

    if (_isRegister) {
      if (_name.text.trim().isEmpty) {
        _setMessage('Preencha seu nome completo.', error: true);
        return;
      }
      if (_password.text.length < 6) {
        _setMessage('A senha precisa ter pelo menos 6 caracteres.', error: true);
        return;
      }
      if (_password.text != _confirmPassword.text) {
        _setMessage('As senhas precisam ser iguais.', error: true);
        return;
      }
    }

    setState(() => _loading = true);

    try {
      if (_isRegister) {
        await supabase.auth.signUp(
          email: _email.text.trim(),
          password: _password.text,
          data: {'full_name': _name.text.trim()},
        );

        _password.clear();
        _confirmPassword.clear();
        if (!mounted) return;
        setState(() {
          _mode = AuthMode.login;
          _message = 'Conta criada. Agora entre com seu e-mail e senha.';
          _isError = false;
        });
      } else {
        await supabase.auth.signInWithPassword(
          email: _email.text.trim(),
          password: _password.text,
        );

        if (!mounted) return;
        _setMessage('Login realizado com sucesso.');
      }
    } on AuthException catch (error) {
      _setMessage(error.message, error: true);
    } catch (_) {
      _setMessage(
        'Nao foi possivel concluir. Confira os dados e tente novamente.',
        error: true,
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = _isRegister ? 'Cadastro' : 'Entrar';

    return Scaffold(
      backgroundColor: _paper,
      body: SafeArea(
        top: false,
        child: ListView(
          padding: EdgeInsets.zero,
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          children: [
            AuthHeader(onBack: () => Navigator.of(context).pop()),
            Transform.translate(
              offset: const Offset(0, -48),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 22),
                child: Column(
                  children: [
                    const SignupLogo(),
                    const SizedBox(height: 14),
                    Text(
                      title,
                      style: const TextStyle(
                        color: _ink,
                        fontSize: 31,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: 48,
                      height: 2,
                      decoration: BoxDecoration(
                        color: _lilac,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(height: 16),
                    if (_isRegister) ...[
                      LightInput(
                        controller: _name,
                        label: 'Nome completo',
                        hint: 'Digite seu nome completo',
                        icon: Icons.person_outline,
                      ),
                      const SizedBox(height: 11),
                    ],
                    LightInput(
                      controller: _email,
                      label: 'E-mail',
                      hint: 'seu@email.com',
                      icon: Icons.mail_outline,
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 11),
                    LightInput(
                      controller: _password,
                      label: 'Senha',
                      hint: 'Digite sua senha',
                      icon: Icons.lock_outline,
                      obscure: true,
                    ),
                    if (_isRegister) ...[
                      const SizedBox(height: 11),
                      LightInput(
                        controller: _confirmPassword,
                        label: 'Confirmar senha',
                        hint: 'Repita sua senha',
                        icon: Icons.lock_outline,
                        obscure: true,
                      ),
                    ],
                    if (_message != null) ...[
                      const SizedBox(height: 12),
                      Text(
                        _message!,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: _isError ? _error : _teal,
                          fontSize: 13,
                          height: 1.35,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _loading ? null : _submit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _teal,
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: _teal.withOpacity(0.55),
                          elevation: 4,
                          shadowColor: _teal.withOpacity(0.28),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(26),
                          ),
                        ),
                        child: _loading
                            ? const SizedBox(
                                width: 21,
                                height: 21,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                            : Text(
                                _isRegister ? 'Criar conta' : 'Login',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    const DividerWithText(),
                    const SizedBox(height: 12),
                    LightSocialButton(
                      icon: Icons.apple,
                      text: 'Continuar com Apple',
                      onTap: () => _setMessage(
                        'Login com Apple ainda nao foi configurado.',
                        error: true,
                      ),
                    ),
                    const SizedBox(height: 10),
                    LightSocialButton(
                      google: true,
                      text: 'Continuar com Google',
                      onTap: () => _setMessage(
                        'Login com Google ainda nao foi configurado.',
                        error: true,
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: () => _setMode(
                        _isRegister ? AuthMode.login : AuthMode.register,
                      ),
                      child: Text.rich(
                        TextSpan(
                          text: _isRegister ? 'Ja tem conta? ' : 'Nao tem conta? ',
                          style: const TextStyle(color: Color(0xFF677083)),
                          children: [
                            TextSpan(
                              text: _isRegister ? 'Entrar' : 'Cadastre-se',
                              style: const TextStyle(
                                color: _lilac,
                                fontWeight: FontWeight.w800,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AuthHeader extends StatelessWidget {
  const AuthHeader({super.key, required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 260,
      child: Stack(
        children: [
          Positioned.fill(child: Container(color: _teal)),
          const Positioned.fill(child: CustomPaint(painter: ContourPainter())),
          Positioned(
            top: 53,
            left: 22,
            child: InkWell(
              onTap: onBack,
              borderRadius: BorderRadius.circular(22),
              child: Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.14),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.arrow_back, color: Colors.white),
              ),
            ),
          ),
          const Positioned(
            top: 91,
            left: 0,
            right: 0,
            child: Column(
              children: [
                Text(
                  'ViSAGiO',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 43,
                    height: 1.06,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  'BELEZA COM PROPOSITO',
                  style: TextStyle(
                    color: Color(0xD8FFFFFF),
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2.4,
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: -1,
            child: SizedBox(
              height: 104,
              child: CustomPaint(painter: HeaderWavePainter()),
            ),
          ),
        ],
      ),
    );
  }
}

class FaceIllustration extends StatelessWidget {
  const FaceIllustration({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 190,
      height: 190,
      decoration: const BoxDecoration(
        color: Color(0xFFF1ECF7),
        shape: BoxShape.circle,
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Icon(
            Icons.face_retouching_natural_outlined,
            color: _lilac.withOpacity(0.92),
            size: 118,
          ),
          const Positioned(
            right: 62,
            top: 78,
            child: FaceDot(size: 7),
          ),
          const Positioned(
            right: 43,
            top: 105,
            child: FaceDot(size: 6),
          ),
          const Positioned(
            right: 76,
            top: 122,
            child: FaceDot(size: 5),
          ),
          Positioned(
            right: 48,
            top: 95,
            child: Transform.rotate(
              angle: 0.64,
              child: Container(width: 43, height: 1, color: _lilac),
            ),
          ),
          Positioned(
            right: 55,
            top: 119,
            child: Transform.rotate(
              angle: -0.43,
              child: Container(width: 36, height: 1, color: _lilac),
            ),
          ),
        ],
      ),
    );
  }
}

class FaceDot extends StatelessWidget {
  const FaceDot({super.key, required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: const BoxDecoration(color: _lilac, shape: BoxShape.circle),
    );
  }
}

class SignupLogo extends StatelessWidget {
  const SignupLogo({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 86,
      height: 86,
      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF273246).withOpacity(0.16),
            blurRadius: 18,
            offset: const Offset(0, 9),
          ),
        ],
      ),
      child: const Stack(
        alignment: Alignment.center,
        children: [
          Positioned(
            top: 16,
            right: 24,
            child: Icon(Icons.auto_awesome, color: _lilac, size: 16),
          ),
          Padding(
            padding: EdgeInsets.only(top: 5),
            child: Text(
              'V',
              style: TextStyle(
                color: _tealDark,
                fontSize: 42,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class LightInput extends StatelessWidget {
  const LightInput({
    super.key,
    required this.controller,
    required this.label,
    required this.hint,
    required this.icon,
    this.keyboardType,
    this.obscure = false,
  });

  final TextEditingController controller;
  final String label;
  final String hint;
  final IconData icon;
  final TextInputType? keyboardType;
  final bool obscure;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: _ink,
            fontSize: 12,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          minHeight: 48,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(9),
            border: Border.all(color: _fieldBorder),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 13),
          child: Row(
            children: [
              Icon(icon, color: const Color(0xFF667386), size: 20),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: controller,
                  keyboardType: keyboardType,
                  obscureText: obscure,
                  cursorColor: _lilac,
                  style: const TextStyle(color: _ink, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: hint,
                    hintStyle: const TextStyle(color: _muted),
                    border: InputBorder.none,
                    isDense: true,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class LightSocialButton extends StatelessWidget {
  const LightSocialButton({
    super.key,
    required this.text,
    required this.onTap,
    this.icon,
    this.google = false,
  });

  final String text;
  final VoidCallback onTap;
  final IconData? icon;
  final bool google;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 46,
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: _ink,
          side: const BorderSide(color: _fieldBorder),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (google)
              const Text(
                'G',
                style: TextStyle(
                  color: Color(0xFF4285F4),
                  fontSize: 19,
                  fontWeight: FontWeight.w900,
                ),
              )
            else
              Icon(icon, color: Colors.black, size: 20),
            const SizedBox(width: 12),
            Text(
              text,
              style: const TextStyle(fontSize: 13, color: _ink),
            ),
          ],
        ),
      ),
    );
  }
}

class DividerWithText extends StatelessWidget {
  const DividerWithText({super.key});

  @override
  Widget build(BuildContext context) {
    return const Row(
      children: [
        Expanded(child: Divider(color: Color(0xFFE7DDF1), height: 1)),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 10),
          child: Text('ou', style: TextStyle(color: Color(0xFF7A8193))),
        ),
        Expanded(child: Divider(color: Color(0xFFE7DDF1), height: 1)),
      ],
    );
  }
}

class PageDot extends StatelessWidget {
  const PageDot({super.key, this.active = false});

  final bool active;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 11,
      height: 11,
      decoration: BoxDecoration(
        color: active ? _teal : const Color(0xFFDDD5EF),
        shape: BoxShape.circle,
      ),
    );
  }
}

class HeaderWavePainter extends CustomPainter {
  const HeaderWavePainter();

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = _paper
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(0, size.height * 0.45)
      ..cubicTo(
        size.width * 0.18,
        size.height * 0.08,
        size.width * 0.55,
        size.height * 0.28,
        size.width,
        size.height * 0.10,
      )
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class ContourPainter extends CustomPainter {
  const ContourPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = Colors.white.withOpacity(0.08);

    for (var i = 0; i < 8; i++) {
      final top = 20.0 + (i * 31);
      final path = Path()
        ..moveTo(-40, top)
        ..cubicTo(
          size.width * 0.18,
          top - 34,
          size.width * 0.34,
          top + 42,
          size.width * 0.58,
          top + 4,
        )
        ..cubicTo(
          size.width * 0.78,
          top - 28,
          size.width * 0.92,
          top + 44,
          size.width + 40,
          top + 10,
        );
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
