import RouteApp from "../RouteApp";

export function generateStaticParams() {
  return [{ route_name: [] }];
}

export default function Page() {
  return <RouteApp />;
}
