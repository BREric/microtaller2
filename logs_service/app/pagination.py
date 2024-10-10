from flask import request

def paginate(query, default_limit=10, default_page=1):
    try:
        limit = int(request.args.get('limit', default_limit))
        page = int(request.args.get('page', default_page))
    except ValueError:
        limit = default_limit
        page = default_page

    offset = (page - 1) * limit
    paginated_query = query.skip(offset).limit(limit)
    return paginated_query