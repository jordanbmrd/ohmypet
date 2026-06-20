import SwiftUI

/// Solid ink CTA — the single high-emphasis action per screen.
struct PrimaryButton: View {
    let title: String
    var systemImage: String? = nil
    var isLoading: Bool = false
    var isEnabled: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Sp.sm) {
                if isLoading {
                    ProgressView().tint(.canvas)
                } else {
                    Text(title).font(.headline)
                    if let systemImage {
                        Image(systemName: systemImage)
                            .font(.system(size: 15, weight: .semibold))
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 54)
            .foregroundStyle(Color.canvas)
            .background(Color.ink)
            .clipShape(RoundedRectangle(cornerRadius: Rd.md, style: .continuous))
            .opacity(isEnabled ? 1 : 0.35)
        }
        .buttonStyle(PressScaleStyle())
        .disabled(!isEnabled || isLoading)
    }
}

/// Quiet, bordered secondary action.
struct SecondaryButton: View {
    let title: String
    var systemImage: String? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Sp.sm) {
                if let systemImage {
                    Image(systemName: systemImage)
                        .font(.system(size: 15, weight: .medium))
                }
                Text(title).font(.callout)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 54)
            .foregroundStyle(Color.ink)
            .background(Color.surface)
            .clipShape(RoundedRectangle(cornerRadius: Rd.md, style: .continuous))
            .hairlineBorder(Rd.md)
        }
        .buttonStyle(PressScaleStyle())
    }
}
