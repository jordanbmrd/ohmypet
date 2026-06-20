import SwiftUI

struct ThemeSelectionView: View {
    let pet: Pet
    @EnvironmentObject private var router: AppRouter
    @State private var selected: PosterTheme?

    var body: some View {
        ZStack {
            Color.canvas.ignoresSafeArea()

            ScrollView {
                VStack(alignment: .leading, spacing: Sp.lg) {
                    VStack(alignment: .leading, spacing: Sp.sm) {
                        Text("Étape 2")
                            .eyebrowStyle()
                        Text("Choisissez un thème")
                            .font(.title1)
                            .tracking(-0.4)
                            .foregroundStyle(Color.ink)
                        Text("Chaque thème est interprété sur mesure d'après la photo.")
                            .font(.callout)
                            .foregroundStyle(Color.inkSoft)
                    }
                    .padding(.top, Sp.sm)

                    VStack(spacing: Sp.sm) {
                        ForEach(Array(PosterTheme.allCases.enumerated()), id: \.element) { index, theme in
                            ThemeRow(theme: theme, number: index + 1, isSelected: selected == theme) {
                                withAnimation(Anim.spring) { selected = theme }
                            }
                        }
                    }
                }
                .padding(.horizontal, Sp.lg)
                .padding(.bottom, 120)
            }

            VStack {
                Spacer()
                PrimaryButton(
                    title: "Générer le portrait",
                    systemImage: "arrow.right",
                    isEnabled: selected != nil
                ) {
                    if let theme = selected {
                        router.push(.generationLoading(pet: pet, theme: theme))
                    }
                }
                .padding(.horizontal, Sp.lg)
                .padding(.bottom, Sp.sm)
                .background(
                    LinearGradient(
                        colors: [.canvas.opacity(0), .canvas, .canvas],
                        startPoint: .top, endPoint: .bottom
                    )
                    .ignoresSafeArea()
                )
            }
        }
        .navigationTitle("Thème")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct ThemeRow: View {
    let theme: PosterTheme
    let number: Int
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Sp.md) {
                ZStack {
                    RoundedRectangle(cornerRadius: Rd.sm, style: .continuous)
                        .fill(theme.accent.opacity(0.12))
                    Image(systemName: theme.symbol)
                        .font(.system(size: 20, weight: .regular))
                        .foregroundStyle(theme.accent)
                }
                .frame(width: 52, height: 52)

                VStack(alignment: .leading, spacing: 2) {
                    Text(theme.title)
                        .font(.headline)
                        .foregroundStyle(Color.ink)
                    Text(theme.subtitle)
                        .font(.caption)
                        .foregroundStyle(Color.inkSoft)
                }

                Spacer()

                ZStack {
                    Circle()
                        .strokeBorder(isSelected ? Color.ink : Color.hairlineStrong, lineWidth: 1.5)
                        .frame(width: 22, height: 22)
                    if isSelected {
                        Circle().fill(Color.ink).frame(width: 12, height: 12)
                    }
                }
            }
            .padding(Sp.md)
            .background(Color.surface)
            .clipShape(RoundedRectangle(cornerRadius: Rd.lg, style: .continuous))
            .hairlineBorder(Rd.lg, color: isSelected ? .ink : .hairline, width: isSelected ? 1.5 : 1)
        }
        .buttonStyle(PressScaleStyle())
    }
}
