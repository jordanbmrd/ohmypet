import SwiftUI

/// Toolbar bag icon with a live item-count badge. Pushes the cart route.
struct CartToolbarButton: ToolbarContent {
    @EnvironmentObject private var router: AppRouter
    @EnvironmentObject private var cart: CartStore

    var body: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            Button {
                router.push(.cart)
            } label: {
                Image(systemName: "bag")
                    .font(.system(size: 16, weight: .regular))
                    .foregroundStyle(Color.ink)
                    .overlay(alignment: .topTrailing) {
                        if cart.count > 0 {
                            Text("\(cart.count)")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundStyle(Color.canvas)
                                .frame(minWidth: 16, minHeight: 16)
                                .background(Color.accent, in: Circle())
                                .offset(x: 9, y: -9)
                        }
                    }
            }
        }
    }
}
