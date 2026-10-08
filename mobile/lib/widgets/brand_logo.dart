import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class BrandLogo extends StatelessWidget {
  const BrandLogo({
    super.key,
    this.size = 36,
    this.showLabel = false,
    this.labelColor,
    this.subtitle,
    this.subtitleColor,
  });

  final double size;
  final bool showLabel;
  final Color? labelColor;
  final String? subtitle;
  final Color? subtitleColor;

  @override
  Widget build(BuildContext context) {
    final logo = ClipRRect(
      borderRadius: BorderRadius.circular(size * 0.22),
      child: Image.asset(
        AppTheme.logoAsset,
        width: size,
        height: size,
        fit: BoxFit.contain,
        errorBuilder: (_, __, ___) => Icon(Icons.business, size: size, color: AppTheme.maroon),
      ),
    );

    if (!showLabel) return logo;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        logo,
        const SizedBox(width: 10),
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'ResponsivCode',
                style: TextStyle(
                  color: labelColor ?? AppTheme.maroonLight,
                  fontWeight: FontWeight.w700,
                  fontSize: size * 0.42,
                  letterSpacing: 0.2,
                ),
              ),
              if (subtitle != null)
                Text(
                  subtitle!,
                  style: TextStyle(
                    color: subtitleColor ?? AppTheme.maroonLight.withValues(alpha: 0.75),
                    fontSize: size * 0.28,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.2,
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class BrandAppBarTitle extends StatelessWidget {
  const BrandAppBarTitle({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const BrandLogo(size: 28),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                title,
                style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
