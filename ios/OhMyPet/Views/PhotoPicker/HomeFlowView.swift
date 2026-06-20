import SwiftUI

/// Hosts the navigation stack and the home screen (species + photo selection).
struct HomeFlowView: View {
    @EnvironmentObject private var router: AppRouter
    @EnvironmentObject private var appState: AppState
    @StateObject private var vm = HomeViewModel()

    var body: some View {
        NavigationStack(path: $router.path) {
            homeContent
                .navigationDestination(for: AppRoute.self) { route in
                    destination(for: route)
                }
        }
    }

    @ViewBuilder
    private var homeContent: some View {
        ZStack {
            Color.canvas.ignoresSafeArea()

            ScrollView {
                VStack(alignment: .leading, spacing: Sp.xl) {
                    header
                    photoArea
                    speciesPicker
                }
                .padding(.horizontal, Sp.lg)
                .padding(.top, Sp.md)
                .padding(.bottom, 120)
            }

            VStack {
                Spacer()
                PrimaryButton(
                    title: "Choisir un thème",
                    systemImage: "arrow.right",
                    isEnabled: vm.hasPhoto
                ) {
                    if let pet = vm.makePet() {
                        router.push(.themeSelection(pet: pet))
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
        .sheet(isPresented: $vm.showPicker) {
            PhotoPicker { image in vm.pickedImage = image }
                .ignoresSafeArea()
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: Sp.md) {
            HStack {
                Text("OhMyPet")
                    .font(.headline)
                    .tracking(0.5)
                    .foregroundStyle(Color.ink)
                Spacer()
                Image(systemName: "pawprint.fill")
                    .font(.system(size: 13))
                    .foregroundStyle(Color.accent)
            }
            .padding(.bottom, Sp.sm)

            Text("Atelier de portraits")
                .eyebrowStyle()

            Text("Votre compagnon,\nen œuvre d'art.")
                .font(.display)
                .tracking(-0.5)
                .foregroundStyle(Color.ink)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private var speciesPicker: some View {
        VStack(alignment: .leading, spacing: Sp.md) {
            Text("L'espèce")
                .font(.callout)
                .foregroundStyle(Color.inkSoft)

            HStack(spacing: Sp.sm) {
                ForEach(PetSpecies.allCases) { species in
                    SpeciesChip(
                        species: species,
                        isSelected: vm.species == species
                    ) {
                        withAnimation(Anim.spring) { vm.species = species }
                    }
                }
            }
        }
    }

    private var photoArea: some View {
        Button {
            vm.showPicker = true
        } label: {
            ZStack {
                if let image = vm.pickedImage {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFill()
                        .frame(maxWidth: .infinity)
                        .frame(height: 380)
                        .clipped()
                } else {
                    VStack(spacing: Sp.md) {
                        Image(systemName: "plus")
                            .font(.system(size: 22, weight: .regular))
                            .foregroundStyle(Color.ink)
                            .frame(width: 52, height: 52)
                            .background(Color.subtle, in: Circle())
                            .overlay(Circle().strokeBorder(Color.hairline, lineWidth: 1))

                        VStack(spacing: Sp.xs) {
                            Text("Ajouter une photo")
                                .font(.headline)
                                .foregroundStyle(Color.ink)
                            Text("Bien cadrée, lumineuse, le regard net")
                                .font(.caption)
                                .foregroundStyle(Color.inkSoft)
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 380)
            .background(Color.subtle)
            .clipShape(RoundedRectangle(cornerRadius: Rd.xl, style: .continuous))
            .hairlineBorder(Rd.xl)
            .overlay(alignment: .bottomTrailing) {
                if vm.hasPhoto {
                    Label("Changer", systemImage: "arrow.triangle.2.circlepath")
                        .font(.callout)
                        .foregroundStyle(Color.ink)
                        .padding(.horizontal, Sp.md)
                        .padding(.vertical, Sp.sm)
                        .background(.ultraThinMaterial, in: Capsule())
                        .overlay(Capsule().strokeBorder(Color.hairline, lineWidth: 1))
                        .padding(Sp.md)
                }
            }
        }
        .buttonStyle(PressScaleStyle())
    }

    @ViewBuilder
    private func destination(for route: AppRoute) -> some View {
        switch route {
        case let .themeSelection(pet):
            ThemeSelectionView(pet: pet)
        case let .generationLoading(pet, theme):
            GenerationLoadingView(
                vm: GenerationViewModel(service: appState.generationService, pet: pet, theme: theme)
            )
        case let .result(job, theme):
            ResultPreviewView(job: job, theme: theme)
        case let .productDetail(category, imageURL, themeTitle):
            ProductDetailView(category: category, imageURL: imageURL, themeTitle: themeTitle)
        case .cart:
            CartView()
        }
    }
}

struct SpeciesChip: View {
    let species: PetSpecies
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Sp.sm) {
                Image(systemName: species.symbol)
                    .font(.system(size: 14))
                Text(species.label).font(.callout)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .foregroundStyle(isSelected ? Color.canvas : Color.ink)
            .background(isSelected ? Color.ink : Color.surface)
            .clipShape(RoundedRectangle(cornerRadius: Rd.md, style: .continuous))
            .hairlineBorder(Rd.md, color: isSelected ? .clear : .hairline)
        }
        .buttonStyle(PressScaleStyle())
    }
}
