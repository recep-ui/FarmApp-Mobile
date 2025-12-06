import 'package:flutter/material.dart';
import 'dart:async';

class BackgroundAnimation extends StatefulWidget {
  final Widget child;

  const BackgroundAnimation({super.key, required this.child});

  @override
  State<BackgroundAnimation> createState() => _BackgroundAnimationState();
}

class _BackgroundAnimationState extends State<BackgroundAnimation>
    with TickerProviderStateMixin {
  // Gradient Animation
  List<Color> colorList = [
    const Color(0xFF2E7D32), // Dark Green
    const Color(0xFF43A047),
    const Color(0xFF66BB6A),
    const Color(0xFF81C784), // Light Green
  ];
  int index = 0;
  Color bottomColor = const Color(0xFF2E7D32);
  Color topColor = const Color(0xFF43A047);
  Alignment begin = Alignment.bottomLeft;
  Alignment end = Alignment.topRight;

  // Cloud Animations
  late AnimationController _cloud1Controller;
  late AnimationController _cloud2Controller;
  late AnimationController _cloud3Controller;

  // Sun Animation
  late AnimationController _sunController;
  late Animation<double> _sunScaleAnimation;

  @override
  void initState() {
    super.initState();

    // Gradient Timer
    Timer.periodic(const Duration(seconds: 4), (Timer t) {
      if (mounted) {
        setState(() {
          index = index + 1;
          bottomColor = colorList[index % colorList.length];
          topColor = colorList[(index + 1) % colorList.length];
        });
      }
    });

    // Cloud Controllers
    _cloud1Controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 45),
    )..repeat();

    _cloud2Controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 65),
    )..repeat();

    _cloud3Controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 85),
    )..repeat();

    // Sun Controller
    _sunController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat(reverse: true);

    _sunScaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.1,
    ).animate(CurvedAnimation(parent: _sunController, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _cloud1Controller.dispose();
    _cloud2Controller.dispose();
    _cloud3Controller.dispose();
    _sunController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Animated Gradient Background
        AnimatedContainer(
          duration: const Duration(seconds: 4),
          onEnd: () {},
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: begin,
              end: end,
              colors: [bottomColor, topColor],
            ),
          ),
          child: const SizedBox.expand(),
        ),

        // Sun
        Positioned(
          top: 40,
          right: 40,
          child: AnimatedBuilder(
            animation: _sunScaleAnimation,
            builder: (context, child) {
              return Transform.scale(
                scale: _sunScaleAnimation.value,
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: const Color(0xFFFFEB3B),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFFFEB3B).withOpacity(0.6),
                        blurRadius: 40,
                        spreadRadius: 10,
                      ),
                      BoxShadow(
                        color: const Color(0xFFFFF176).withOpacity(0.4),
                        blurRadius: 80,
                        spreadRadius: 20,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),

        // Clouds
        _buildAnimatedCloud(_cloud1Controller, 120, 60, top: 0.15),
        _buildAnimatedCloud(
          _cloud2Controller,
          100,
          50,
          top: 0.25,
          opacity: 0.6,
          delay: 0.2,
        ),
        _buildAnimatedCloud(
          _cloud3Controller,
          140,
          70,
          top: 0.10,
          opacity: 0.4,
          delay: 0.5,
        ),

        // Child Content
        widget.child,
      ],
    );
  }

  Widget _buildAnimatedCloud(
    AnimationController controller,
    double width,
    double height, {
    double top = 0.1,
    double opacity = 0.8,
    double delay = 0.0,
  }) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        final screenWidth = MediaQuery.of(context).size.width;
        // Move from -width to screenWidth + width
        final xPos =
            (controller.value + delay) % 1.0 * (screenWidth + width + 50) -
            width;
        final yPos = MediaQuery.of(context).size.height * top;

        return Positioned(
          left: xPos,
          top: yPos,
          child: Opacity(
            opacity: opacity,
            child: Container(
              width: width,
              height: height,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(50),
              ),
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  Positioned(
                    top: -height * 0.4,
                    left: width * 0.15,
                    child: Container(
                      width: width * 0.35,
                      height: width * 0.35,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  Positioned(
                    top: -height * 0.5,
                    left: width * 0.4,
                    child: Container(
                      width: height,
                      height: height,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
