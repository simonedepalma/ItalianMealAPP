import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};