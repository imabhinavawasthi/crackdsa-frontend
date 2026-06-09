import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbsItem {
  title: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbsItem[];
  className?: string;
  listClassName?: string;
  separatorClassName?: string;
  separator?: React.ReactNode;
}

export default function Breadcrumbs({
  items,
  className,
  listClassName,
  separatorClassName,
  separator,
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className={listClassName}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold truncate max-w-50 sm:max-w-none">
                    {item.title}
                  </BreadcrumbPage>
                ) : item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {item.title}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">{item.title}</span>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className={separatorClassName}>
                  {separator}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
