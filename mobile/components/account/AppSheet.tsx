import { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";

const DEFAULT_SNAP_POINTS = ["25%", "50%"];

type AppSheetProps = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
};

const AppSheet = forwardRef<BottomSheetModal, AppSheetProps>(
  ({ children, snapPoints: snapPointsProp }, ref) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const snapPoints = useMemo(
      () => snapPointsProp ?? DEFAULT_SNAP_POINTS,
      [snapPointsProp],
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: isDark ? "#111111" : "#ffffff" }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#555555" : "#cccccc",
        }}
      >
        <BottomSheetView className="flex-1 p-2">{children}</BottomSheetView>
      </BottomSheetModal>
    );
  },
);

AppSheet.displayName = "AppSheet";
export default AppSheet;
